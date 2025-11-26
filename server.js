import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `Greeting :
“Hello! I’m your Faith & Culture Ads Advisor...”`;

app.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content
    })),
    { role: "user", content: message }
  ];

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages
  });

  res.json({
    reply: completion.choices[0].message.content
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
