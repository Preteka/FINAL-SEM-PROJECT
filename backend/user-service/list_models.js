import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("No API key found in .env");
            return;
        }

        const modelsToTest = ['gemini-flash-latest', 'gemini-pro-latest', 'gemini-2.0-flash-lite'];
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        for (const modelName of modelsToTest) {
            console.log(`Testing ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello. Say 'OK'.");
                const response = await result.response;
                console.log(`- ${modelName} Response: ${response.text()}`);
            } catch (err) {
                console.log(`- ${modelName} Failed: ${err.message}`);
            }
        }

    } catch (error) {
        console.error("Test Script Error:", error.message);
    }
}

testModels();
