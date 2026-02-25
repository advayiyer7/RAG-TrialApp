import { mastra } from "./src/mastra/index";

// Quick test: ask the RAG agent a question
async function main() {
  const agent = mastra.getAgent("ragAgent");

  const question = process.argv[2] || "What are the main topics covered in the course materials?";

  console.log(`\n❓ Question: ${question}\n`);

  const response = await agent.generate([
    { role: "user", content: question },
  ]);

  console.log(`💡 Answer:\n${response.text}\n`);
}

main().catch(console.error);