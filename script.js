// === KONFIGURASJON FOR SUPABASE ===
// Sett inn din faktiske URL og publishable key (sb_publishable_...)

const supabaseUrl = "https://jradbtzebvckrdzvykbn.supabase.co";
const supabaseKey = "sb_publishable_OGbLv8JL-eCOOoiU_Z6FlQ_iQnnEQpG";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// === HENT ELEMENTER FRA HTML ===
const form = document.getElementById("coachForm");
const resultEl = document.getElementById("result");
const aiPlanEl = document.getElementById("ai-plan");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const sport = document.getElementById("sport").value;
  const goal = document.getElementById("goal").value;
  const hours = document.getElementById("hours").value;

  // 1. Vis grunn-tekst
  resultEl.textContent = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;

  // Nullstill AI-tekst
  if (aiPlanEl) {
    aiPlanEl.textContent = "Lager et forslag til treningsplan basert på målene dine...";
  }

  // 2. LAGRE I SUPABASE
  try {
    const { data, error } = await supabase
      .from("form_submissions")
      .insert([
        {
          sport,
          goal,
          hours_per_week: Number(hours),
        },
      ]);

    if (error) {
      console.error("Supabase-feil:", error);
      alert("Feil ved lagring i database: " + error.message);
    } else {
      console.log("Lagret i Supabase:", data);
      // du kan beholde eller fjerne alert
      alert("Lagret i database ✅");
    }
  } catch (err) {
    console.error("Uventet Supabase-feil:", err);
    alert("Uventet feil ved lagring i database");
  }

  // 3. HENT AI-PLAN FRA /api/generate-plan
  try {
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sport, goal, hours }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Feil fra /api/generate-plan:", txt);
      if (aiPlanEl) {
        aiPlanEl.textContent =
          "Klarte ikke å lage treningsplan akkurat nå (feil " + response.status + ").";
      }
      return;
    }

    const json = await response.json();

    if (json.plan && aiPlanEl) {
      aiPlanEl.textContent = json.plan;
    } else if (aiPlanEl) {
      aiPlanEl.textContent = "Fikk svar, men ingen plan ble generert.";
    }
  } catch (err) {
    console.error("Feil ved kall til generate-plan:", err);
    if (aiPlanEl) {
      aiPlanEl.textContent =
        "Det oppsto en feil når vi prøvde å lage treningsplanen din.";
    }
  }
});

