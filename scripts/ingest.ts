/**
 * Ingestion Script
 *
 * Usage: bun run ingest
 *
 * Reads all PDFs from the `pdfs/` directory, chunks them,
 * generates embeddings, and stores them in Qdrant.
 */

import path from "path";
import { fileURLToPath } from "url";
import { ingestPdfs } from "../src/mastra/rag/ingest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.resolve(__dirname, "../pdfs");

console.log("🚀 Starting PDF ingestion...");
console.log(`📁 PDF directory: ${PDF_DIR}\n`);

await ingestPdfs({
  pdfDir: PDF_DIR,
  chunkSize: 1000,
  chunkOverlap: 200,
});