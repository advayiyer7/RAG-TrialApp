import { createVectorQueryTool } from "@mastra/rag";
import { openai } from "@ai-sdk/openai";
import { qdrant } from "../rag/vector-store";

export const courseSearchTool = createVectorQueryTool({
  id: "course-search-tool",
  description:
    "Search through course lecture notes, slides, and documents to find information needed to answer the user's question. Returns relevant passages with source PDF attribution.",
  vectorStoreName: "qdrant",
  vectorStore: qdrant,
  indexName: "course_documents",
  model: openai.embedding("text-embedding-3-small"),
});