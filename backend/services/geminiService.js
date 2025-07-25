import { GoogleGenerativeAI } from "@google/generative-ai";
import { envDefaults } from "../envDefaults.js";

/**
 * GeminiService - A service class for interacting with Google's Gemini AI model
 * 
 * This service provides a wrapper around the Google Generative AI SDK to:
 * - Initialize connection to Gemini AI models
 * - Generate content using the specified model
 * 
 * @class GeminiService
 * @example
 * const geminiService = new GeminiService();
 * const response = await geminiService.generateContent("Hello, how are you?");
 */
class GeminiService {
  /**
   * Creates a new instance of GeminiService
   * 
   * Initializes the Google Generative AI client with the API key from environment variables.
   * Sets up the model configuration for content generation.

   */
  constructor() {
    // Get API key from environment defaults
    this.apiKey = envDefaults.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }

    // Initialize Google Generative AI client
    this.ai = new GoogleGenerativeAI(this.apiKey);
    // Get the specified model (e.g., "gemini-2.5-flash")
    this.model = this.ai.getGenerativeModel({
      model: envDefaults.GEMINI_MODEL,
    });
  }

  /**
   * Generates content using the Gemini AI model
   * 
   * Sends a message to the Gemini AI model and processes the response.
   * Attempts to extract JSON from the response if it's wrapped in code blocks.
   * Falls back to returning the raw text if no JSON is found.
   * @param {string} message - The message/prompt to send to the AI model
   * @returns {Promise<Object|{text: string}>} The AI response, either as parsed JSON or raw text
  
   * // Generate a structured response
   * const response = await geminiService.generateContent("List the top 3 programming languages");
   * // Returns: { languages: ["JavaScript", "Python", "Java"] }

   */
  async generateContent(message) {
    // Format message for Gemini API
    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];
    
    console.log("calling gemini");
    
    // Generate content with temperature setting for creativity
    const response = await this.model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7, // Controls randomness (0.0 = deterministic, 1.0 = very random)
      },
    });

    // Get raw text response
    const rawText = await response.response.text();
    
    // Try to extract JSON from code blocks (```json ... ```)
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);

    // Return raw text if no JSON found, otherwise parse and return JSON
    if (!jsonMatch || !jsonMatch[1]) {
      return {text:rawText};
    }
    
    // Clean and parse the JSON string
    const cleanJsonString = jsonMatch[1].trim();
    const parsedResponse = JSON.parse(cleanJsonString);
    return parsedResponse;
  }

  /**
   * Performs a health check on the Gemini AI service
   * 
   * Sends a simple "Hello" message to verify that the service is working correctly.
   * Useful for testing connectivity and API key validity.
   * 
   * @returns {Promise<Object>} The response from the ping request

   */
  async ping() {
    // Simple health check - just ask for a hello response
    return this.generateContent("Hello! Just say 'Hello' back.");
  }
}

export default GeminiService;
