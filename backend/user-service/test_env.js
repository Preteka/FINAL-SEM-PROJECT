import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Checking GEMINI_API_KEY...");
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);

try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("GoogleGenerativeAI initialized successfully");
} catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error.message);
}
