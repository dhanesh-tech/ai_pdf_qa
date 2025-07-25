import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getChroma, storeInChroma } from "./chroma.js";
import { Document } from "@langchain/core/documents";

/**
 * Processes PDF data by splitting text into chunks and storing them in a vector database
 *
 * @param {Object} data - The PDF data object containing pages and metadata
 * @param {Array<Object>} data.pages - Array of page objects
 * @param {number} data.pages[].page - Page number (0-indexed)
 * @param {string} data.pages[].md - Markdown content of the page
 * @param {Object} data.job_metadata - Additional metadata for the job
 * @returns {Promise<Object>} The vector store instance after storing the chunks
 *
 * @example
 * const pdfData = {
 *   pages: [
 *     { page: 0, md: 'Page 0 content...' },
 *     { page: 1, md: 'Page 1 content...' }
 *   ],
 *   job_metadata: { filename: 'document.pdf' }
 * };
 * const vectorStore = await getEmbeddingsAndStoreInDb(pdfData);
 */
export const getEmbeddingsAndStoreInDb = async (data) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 30,
  });

  const allChunks = [];
  //iterate on each page and create chunks
  for (const pageData of data.pages) {
    const { page, md } = pageData;
    // create chunks for each pages text
    const pageChunks = await splitter.createDocuments(
      [md],
      [
        { page: String(page) }, //  pass metadata here
      ]
    );

    // Attach metadata manually if needed
    const chunksWithPage = pageChunks.map((chunk) => {
      return new Document({
        pageContent: chunk.pageContent,
        metadata: {
          ...chunk.metadata,
          page: page, // keep page info explicitly
        },
      });
    });
    // all chunks of a page
    allChunks.push(...chunksWithPage);
  }

  const vectorStore = await storeInChroma(allChunks);
  return vectorStore;
};
/**
 * Retrieves similar documents from the vector store based on a query
 *
 * @param {string} query - The search query to find similar documents
 * @param {number} [matchCount=10] - The number of similar documents to retrieve
 * @returns {Promise<Array<Document>>} Array of similar documents with their content and metadata
 */
export const retreiveFromVectorStore = async (query, matchCount = 10) => {
  const vectorStore = await getChroma();
  const results = await vectorStore.similaritySearch(query, matchCount);
  return results;
};
