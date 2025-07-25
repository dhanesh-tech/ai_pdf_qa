import { GoogleGenerativeAI } from "@google/generative-ai";
import { envDefaults } from "../envDefaults.js";


class GeminiService {
  constructor() {
    this.apiKey = envDefaults.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }

    this.ai = new GoogleGenerativeAI(this.apiKey);
    this.model = this.ai.getGenerativeModel({
      model: envDefaults.GEMINI_MODEL, // e.g., "gemini-2.5-flash"
    });
  }

  async generateContent(message) {
    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];
    console.log("calling gemini");
    const response = await this.model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
      },
    });

    const rawText = await response.response.text();
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch || !jsonMatch[1]) {
      return {text:rawText};
    }
    
    const cleanJsonString = jsonMatch[1].trim();
    const parsedResponse = JSON.parse(cleanJsonString);
    return parsedResponse;
  }

  async ping() {
    return this.generateContent("Hello! Just say 'Hello' back.");
  }
}

export default GeminiService;
