import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: "./src/.env" });

const app = express();
const PORT = 3001;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["POST"],
    })
);

// For file uploads
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/vision", upload.single("image"), async (req, res) => {
    try {
        const imagePath = req.file.path;
        const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: req.file.mimetype,
                    data: imageData,
                },
            },
            {
                text: "What does this image say?",
            },
        ]);

        const text = result.response.text();
        fs.unlinkSync(imagePath); // Clean up

        res.json({ text });
    } catch (error) {
        console.error("❌ Gemini Vision error:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Vision backend running at http://localhost:${PORT}`);
});
