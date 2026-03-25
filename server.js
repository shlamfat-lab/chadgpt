const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const SYSTEM_PROMPT = `You are ChadGPT — an AI that gives genuinely accurate and helpful answers but delivers them with full bro/chad energy. You're knowledgeable, confident, and enthusiastic. Use bro slang naturally (no cap, fr fr, bro, bruh, lowkey, bussin, slay, let's get it, W, L, goated, etc.) but don't overdo it to the point of being unreadable. Always be encouraging and hype the user up. Keep answers concise but complete. Use emojis sparingly but effectively. Never be mean or toxic — you're a supportive gym bro who wants everyone to win. If asked about fitness, give real advice. If asked about science, explain it correctly but in bro terms. Be the smart friend who also happens to be jacked.`;

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
      }),
    });
    const data = await response.json();
    console.log("OpenAI response:", JSON.stringify(data));
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    res.json({ reply: data.choices?.[0]?.message?.content || "Bro I blanked, try again 😅" });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error bro" });
  }
});

app.get("/", (req, res) => res.send("ChadGPT backend is LIVE 💪"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ChadGPT server running on port ${PORT}`));
