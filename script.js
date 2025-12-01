// Enkel test-versjon av script.js
// 1) Lagrer i Supabase
// 2) Viser en tydelig test-tekst i AI-boksen

// === SUPABASE-KONFIG ===
const supabaseUrl = "https://jradbtzebvckrdzvykbn.supabase.co";
const supabaseKey = "sb_publishable_OGbLv8JL-etcetc";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// === HENT HTML-ELEMENTER ===
const form = document.getElementById("coachForm");
const resultEl = document.getElementById("result");
const aiPlanEl = document.getElementById("ai-plan");

// Bare for debugging:
console.log("script.js lastet", { form, resultEl, aiPlanEl });

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const sport = document.getElementById("sport").value;
  const goal = document.getElementById("goal").value;
  const hours = document.getElementById("hours").value;

  // 1) Vanlig grønn tekst
  const output = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;
  resultEl.textContent = output;

  // 2) TEST: skriv noe i AI-boksen uansett
  aiPlanEl.textContent =
    "TEST: Hvis du ser denne teksten etter at du har sendt inn skjemaet, fungerer script.js og ai-plan-diven.";

  // 3) Lagre i Supabase (samme som før)
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
      alert("Lagret i database ✅");
    }
  } catch (err) {
    console.error("Uventet Supabase-feil:", err);
    alert("Uventet feil ved lagring i database");
  }
});
