// Supabase-detaljer (disse kommer fra Supabase → App Frameworks)
const supabaseUrl = "https://jradbtzebvckrdzvykbn.supabase.co";
const supabaseKey = "sb_publishable_OGbLv8JL-eCO0oiU_Z6FlQ_iQnnEQpG";

// Lag Supabase-klient (kobling til databasen din)
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Finn skjema og resultatområde
const form = document.getElementById("coachForm");
const resultEl = document.getElementById("result");

// Når skjemaet sendes inn:
form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Hindrer at siden refresher

    const sport = document.getElementById("sport").value;
    const goal = document.getElementById("goal").value;
    const hours = document.getElementById("hours").value;

    // 1) Vis tekst på nettsiden som før
    const output = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;
    resultEl.textContent = output;

    // 2) Lagre i Supabase-tabellen "form_submissions"
    try {
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
            console.error("Feil ved lagring i Supabase:", error);
        } else {
            console.log("Lagret i Supabase:", data);
        }
    } catch (err) {
        console.error("Uventet feil:", err);
    }
});
