import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend
const __dirname = path.resolve();
app.use(express.static(__dirname)); // Makes index.html available

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

// Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});