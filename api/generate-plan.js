// api/generate-plan.js
// Vercel server-funksjon som snakker med OpenAI og lager en kort treningsplan.

export default async function handler(req, res) {
  // Bare POST er lov
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Les body (fungrer både hvis Vercel allerede har parsset, eller ikke)
    let bodyData = req.body;

    if (typeof bodyData === "string" || !bodyData) {
      let raw = "";
      await new Promise((resolve) => {
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", resolve);
      });

      if (raw) {
        bodyData = JSON.parse(raw);
      } else {
        bodyData = {};
      }
    }

    const { sport, goal, hours } = bodyData;

    if (!sport || !goal || !hours) {
      res.status(400).json({ error: "Mangler sport, mål eller timer" });
      return;
    }

    const prompt = `
Du er en vennlig, norsk treningscoach.

Brukerens idrett: ${sport}
Brukerens mål: ${goal}
Tilgjengelige timer per uke: ${hours}

Lag en kort, konkret treningsplan for 1–2 uker:
- Maks 6 punkter.
- Ingen medisinske råd, bare generelle treningsforslag.
- Skriv på norsk.
`;

    // Kall OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Du er en norsk treningscoach som gir korte, konkrete og trygge råd.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 250,
      }),
    });

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      console.error("OpenAI error:", txt);
      res.status(500).json({ error: "Feil fra OpenAI" });
      return;
    }

    const data = await openaiRes.json();
    const plan = data.choices?.[0]?.message?.content?.trim() || "";

    if (!plan) {
      res.status(500).json({ error: "Tomt svar fra OpenAI" });
      return;
    }

    res.status(200).json({ plan });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Serverfeil i generate-plan" });
  }
}
