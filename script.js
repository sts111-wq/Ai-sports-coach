// 1. Supabase-detaljer
const supabaseUrl = "https://jradbtzebvckrdzvykbn.supabase.co";
const supabaseKey = "sb_secret_lXz6UdLpT4ejQ0Fn0PiQLw_mnmhZgFI";

// 2. Lag Supabase-klient fra CDN (window.supabase kommer fra index.html)
const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Finn skjema og resultat-element
const form = document.getElementById("coachForm");
const resultEl = document.getElementById("result");

// 4. Håndter innsending av skjema
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const sport = document.getElementById("sport").value;
    const goal = document.getElementById("goal").value;
    const hours = document.getElementById("hours").value;

    // Vis tekst på siden (samme som før)
    const output = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;
    resultEl.textContent = output;

    // Prøv å lagre i Supabase
    const { data, error } = await supabase
        .from("form_submissions")
        .insert([
            {
                sport: sport,
                goal: goal,
                hours_per_week: Number(hours)
            }
        ]);

    if (error) {
        console.error("Supabase-feil:", error);
        alert("Feil ved lagring i Supabase: " + error.message);
    } else {
        console.log("Lagret i Supabase:", data);
        alert("Lagret i database ✅");
    }
});

