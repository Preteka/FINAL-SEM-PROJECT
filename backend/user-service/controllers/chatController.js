import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("Error: GEMINI_API_KEY is missing in environment variables");
            return res.status(500).json({ error: "API Key not configured on server" });
        }

        // Try gemini-1.5-flash first
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a helpful assistant for Vinayaga Glass and Plywoods. Answer questions about plywood, glass, and interior design. Keep answers concise.\n\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Chat Generative AI Error:", error);
        const fs = await import('fs');
        fs.appendFileSync('error.log', `${new Date().toISOString()} - ${error.message}\n${JSON.stringify(error, null, 2)}\n\n`);
        res.status(500).json({ error: "Failed to get response from AI. Please try again." });
    }
};
