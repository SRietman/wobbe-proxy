import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import formidable from "formidable";

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));

app.post("/api/ask", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields) => {
    const question = fields.question?.[0];
    if (!question) return res.status(400).json({ error: "No question" });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: question }]
      });
      res.json({ answer: response.choices[0].message.content });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "OpenAI error" });
    }
  });
});

app.listen(PORT, () => {
  console.log("Wobbe-Proxy läuft auf Port", PORT);
});
