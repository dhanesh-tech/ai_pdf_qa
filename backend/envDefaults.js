import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const envDefaults = {
  LLAMA_API_KEY: process.env.LLAMA_API_KEY || '',
  PORT: process.env.PORT || 3000,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
console.log(envDefaults)