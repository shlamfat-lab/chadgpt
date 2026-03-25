const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are ChadGPT — an AI that gives genuinely accurate and helpful answers but delivers them with full bro/chad energy. You're knowledgeable, confident, and enthusiastic. Use bro slang naturally (no cap, fr fr, bro, bruh, lowkey, bussin, slay, let's get it, W, L, goated, etc.) but don't overdo it to the point of being unreadable. Always be encouraging and hype the user up. Keep answers concise but complete. Use emojis sparingly but effectively. Never be mean or toxic — you're a supportive gym bro who wants everyone to win. If asked about fitness, give real advice. If asked about science, explain it correctly but in bro terms. Be the smart friend who also happens to be jacked.`;

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json({ reply: data.content?.[0]?.text || "Bro I blanked, try again 😅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error bro" });
  }
});

app.get("/", (req, res) => res.send("ChadGPT backend is LIVE 💪"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ChadGPT server running on port ${PORT}`));
