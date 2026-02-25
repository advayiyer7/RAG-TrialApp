import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { qdrant, COLLECTION_NAME, EMBEDDING_DIMENSION } from "./vector-store";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

interface IngestOptions {
  pdfDir: string;       // Directory containing PDFs
  chunkSize?: number;   // Characters per chunk (default: 1000)
  chunkOverlap?: number; // Overlap between chunks (default: 200)
}

/**
 * Extract text from a single PDF file
 */
async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Ingest all PDFs from a directory into Qdrant
 */
export async function ingestPdfs(options: IngestOptions) {
  const { pdfDir, chunkSize = 1000, chunkOverlap = 200 } = options;

  // 1. Find all PDF files
  const pdfFiles = fs
    .readdirSync(pdfDir)
    .filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    console.log("No PDF files found in", pdfDir);
    return;
  }

  console.log(`Found ${pdfFiles.length} PDF(s) to ingest:`);
  pdfFiles.forEach((f) => console.log(`  - ${f}`));

  // 2. Create Qdrant collection (if it doesn't exist)
  try {
    await qdrant.createIndex({
      indexName: COLLECTION_NAME,
      dimension: EMBEDDING_DIMENSION,
    });
    console.log(`\nCreated Qdrant collection: ${COLLECTION_NAME}`);
  } catch (err: any) {
    // Collection might already exist, that's fine
    if (err.message?.includes("already exists")) {
      console.log(`\nQdrant collection "${COLLECTION_NAME}" already exists, continuing...`);
    } else {
      throw err;
    }
  }

  // 3. Process each PDF
  let totalChunks = 0;

  for (const pdfFile of pdfFiles) {
    const filePath = path.join(pdfDir, pdfFile);
    console.log(`\nProcessing: ${pdfFile}`);

    // Extract text
    const text = await extractPdfText(filePath);
    console.log(`  Extracted ${text.length} characters`);

    if (text.trim().length === 0) {
      console.log(`  Skipping (no text content)`);
      continue;
    }

    // Chunk the text using MDocument
    const doc = MDocument.fromText(text);
    const chunks = await doc.chunk({
      strategy: "recursive",
      size: chunkSize,
      overlap: chunkOverlap,
    });

    console.log(`  Split into ${chunks.length} chunks`);

    // Generate embeddings
    const { embeddings } = await embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: openai.embedding("text-embedding-3-small"),
      maxRetries: 3,
    });

    console.log(`  Generated ${embeddings.length} embeddings`);

    // Store in Qdrant with metadata
    await qdrant.upsert({
      indexName: COLLECTION_NAME,
      vectors: embeddings,
      metadata: chunks.map((chunk, index) => ({
        text: chunk.text,
        source: pdfFile,              // Which PDF this came from
        chunkIndex: index,            // Position within the PDF
        totalChunks: chunks.length,   // Total chunks from this PDF
      })),
    });

    console.log(`  Stored ${embeddings.length} vectors in Qdrant`);
    totalChunks += chunks.length;
  }

  console.log(`\n✅ Ingestion complete! ${totalChunks} total chunks from ${pdfFiles.length} PDF(s)`);
}