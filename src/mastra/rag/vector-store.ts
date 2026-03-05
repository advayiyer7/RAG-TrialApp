import { QdrantVector } from "@mastra/qdrant";

export const qdrant = new QdrantVector({
  id: "qdrant",
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
  https: true,
});

export const COLLECTION_NAME = "course_documents";
export const EMBEDDING_DIMENSION = 1536;