import { QdrantVector } from "@mastra/qdrant";

// Initialize Qdrant vector store client
export const qdrant = new QdrantVector({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
  https: true,
});

// Collection name for course PDFs
export const COLLECTION_NAME = "course_documents";

// OpenAI text-embedding-3-small produces 1536-dimensional vectors
export const EMBEDDING_DIMENSION = 1536;