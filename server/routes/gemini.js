import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text });
    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ error: "Failed to get Gemini response" });
    }
});

export default router;
