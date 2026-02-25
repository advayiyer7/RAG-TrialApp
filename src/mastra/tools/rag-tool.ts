import { createVectorQueryTool } from "@mastra/rag";
import { openai } from "@ai-sdk/openai";

/**
 * Tool that searches the course documents vector store.
 * The agent calls this automatically when it needs to answer questions.
 */
export const courseSearchTool = createVectorQueryTool({
  id: "course-search-tool",
  description:
    "Search through course lecture notes, slides, and documents to find information needed to answer the user's question. Returns relevant passages with source PDF attribution.",
  vectorStoreName: "qdrant",
  indexName: "course_documents",
  model: openai.embedding("text-embedding-3-small"),
});