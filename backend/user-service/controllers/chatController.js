import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        const provider = process.env.AI_PROVIDER || 'gemini';

        const prompt = `
            You are "Vinayaga Assistant", a professional and expert consultant for Vinayaga Glass and Plywoods.
            Your goal is to provide helpful, polite, and detailed advice on:
            - Plywood types (BWP, BWR, MR grade) and their applications (kitchen, bathroom, furniture).
            - Glass types (toughened, frosted, tinted) and interior design ideas.
            - Interior color combinations and space optimization.
            
            Keep your tone professional yet welcoming. provide concise but informative answers.
            If you don't know an answer, politely ask the user to contact the Vinayaga team directly.
            
            User Message: ${message}
        `;

        let replyText = "";

        if (provider === 'groq') {
            if (!process.env.GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY is missing in environment variables");
            }

            console.log("Using Groq AI Provider...");
            const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "You are Vinayaga Assistant, a professional consultant for Vinayaga Glass and Plywoods." },
                        { role: "user", content: prompt }
                    ]
                })
            });

            const groqData = await groqResponse.json();
            if (!groqResponse.ok) {
                throw new Error(`Groq API Error: ${groqData.error?.message || 'Unknown error'}`);
            }
            replyText = groqData.choices[0].message.content;

        } else {
            // Default to Gemini
            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
                throw new Error("GEMINI_API_KEY is missing or configured incorrectly");
            }

            console.log("Using Gemini AI Provider...");
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            replyText = response.text();
        }

        res.json({ reply: replyText });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({
            error: "Failed to get response from AI.",
            details: error.message
        });
    }
};
