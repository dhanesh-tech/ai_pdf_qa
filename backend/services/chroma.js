// lib/memoryVectorStore.js
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { envDefaults } from "../envDefaults.js";

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: envDefaults.HUGGINGFACE_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

// Lazy init — call setup when ready
// Patch numDimensions manually
embeddings.embeddingDimensions = 384;
let vectorStore = new MemoryVectorStore(embeddings);

/**
 * Stores documents in the vector store
 * @param {Array<Document>} documents - The documents to store in the vector store
 * @returns {Promise<MemoryVectorStore>} The vector store instance after storing the documents
 */
export const storeInChroma = async (documents) => {
  // Clear existing database by creating a new vector store instance
  vectorStore = new MemoryVectorStore(embeddings);
  // Add new documents to the fresh database
  await vectorStore.addDocuments(documents);
  return vectorStore;
};

/**
 * Retrieves the vector store instance
 * @returns {MemoryVectorStore} The vector store instance
 */
export const getChroma = () => {
  if (!vectorStore) throw new Error("Vector store not initialized yet");
  return vectorStore;
};