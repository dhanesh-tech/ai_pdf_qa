// llamaParse.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { envDefaults } from "../envDefaults.js";

/**
 * Uploads a PDF file to the LlamaParse API and returns the job ID
 * @param {string} filePath - The path to the PDF file to upload
 * @returns {Promise<string>} The job ID of the uploaded PDF
 */
export const uploadPdfToLlamaParse = async (filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), {
    filename: filePath.split("/").pop(),
    contentType: "application/pdf",
  });

  const headers = {
    ...form.getHeaders(),
    Authorization: `Bearer ${envDefaults.LLAMA_API_KEY}`,
  };

  const response = await axios.post(
    "https://api.cloud.llamaindex.ai/api/v1/parsing/upload",
    form,
    { headers }
  );
  return response?.data?.id;
};

/**
 * Fetches the parsed result from the LlamaParse API for a given job ID
 * @param {string} jobId - The ID of the job to fetch the result for
 * @returns {Promise<Object>} The parsed result of the PDF
 */
export const fetchParsedResult = async (jobId) => {
  // Validate jobId before making the request
  if (!jobId || jobId === "undefined") {
    throw new Error("Invalid job ID provided");
  }
  console.log("makeing job request", jobId);

  const response = await axios.get(
    `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/json`,
    {
      headers: {
        Authorization: `Bearer ${envDefaults.LLAMA_API_KEY}`,
        accept: "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Checks the status of a parsing job for a given job ID
 * @param {string} jobId - The ID of the job to check the status of
 * @returns {Promise<Object>} The status of the job
 */
export const getStatusOfPdf = async (jobId) => {
  // Validate jobId before making the request
  if (!jobId || jobId === "undefined") {
    throw new Error("Invalid job ID provided");
  }

  console.log("Checking job status for:", jobId);

  const response = await axios.get(
    `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${envDefaults.LLAMA_API_KEY}`,
        accept: "application/json",
      },
    }
  );

  return response.data;
};
