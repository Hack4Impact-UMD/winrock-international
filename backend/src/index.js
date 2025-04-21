import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: "./src/.env" });
const app = express();
const PORT = 3001;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["POST", "GET"],
        credentials: true,
    })
);
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.post("/api/gemini", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("📝 Prompt received:", prompt);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite", // ✅ JUST this string — SDK adds "models/" and uses v1
        });
        const result = await model.generateContent(prompt);

        console.log("✅ Gemini API response received");
        const text = result.response.text();

        res.json({ text });
    } catch (error) {
        console.error("❌ Error hitting Gemini:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
