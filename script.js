// === KONFIGURER SUPABASE HER ===
// URL-en din ser ut til å være denne (fra tidligere skjermbilder):
const supabaseUrl = "https://jradbtzebvckrdzvykbn.supabase.co";

// BYTT UT DENNE TEKSTEN med din PUBLISHABLE key fra Supabase (sb_publishable_....)
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyYWRidHplYnZja3JkenZ5a2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjU2MjMsImV4cCI6MjA3OTgwMTYyM30.i8e9XV8wP9-cUPJiDc4W2Mlz9ZEAXSKYkVelmH10ZCk";

// Lag Supabase-klient
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Hent HTML-elementer
const form = document.getElementById("coachForm");
const resultEl = document.getElementById("result");
const aiPlanEl = document.getElementById("ai-plan");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const sport = document.getElementById("sport").value;
  const goal = document.getElementById("goal").value;
  const hours = document.getElementById("hours").value;

  // Nullstill AI-tekst
  aiPlanEl.textContent = "";

  // 1) Vis enkel tekst direkte på siden
  const output = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;
  resultEl.textContent = output;

  // 2) Lagre i Supabase
  try {
    const { data, error } = await supabase
      .from("form_submissions")
      .insert([
        {
          sport: sport,
          goal: goal,
          hours_per_week: Number(hours),
        },
      ]);

    if (error) {
      console.error("Supabase-feil:", error);
      alert("Feil ved lagring i Supabase: " + error.message);
    } else {
      console.log("Lagret i Supabase:", data);
      // Hvis du ikke vil ha popup lenger kan du kommentere ut neste linje:
      alert("Lagret i database ✅");
    }
  } catch (err) {
    console.error("Uventet Supabase-feil:", err);
    alert("Uventet feil ved lagring i database");
  }

  // 3) Spør vår egen server (/api/generate-plan) om et AI-forslag
  try {
    aiPlanEl.textContent =
      "Lager et kort forslag til treningsfokus basert på målene dine...";

    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sport, goal, hours }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Feil fra /api/generate-plan:", text);
      throw new Error("Server svarte med status " + response.status);
    }

    const json = await response.json();

    if (json.plan) {
      aiPlanEl.textContent = json.plan;
    } else {
      aiPlanEl.textContent =
        "Klarte ikke å lage et forslag akkurat nå (tomt svar).";
    }
  } catch (err) {
    console.error("Feil ved AI-kall:", err);
    aiPlanEl.textContent =
      "Det skjedde en feil når vi prøvde å lage et forslag akkurat nå: " +
      err.message;
  }
});
