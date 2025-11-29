// Sett inn Supabase-detaljene dine her:
const SUPABASE_URL = "https://jradbtzebvckrdzvykbn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_OGbLv8JL-eCOOoiU_Z6FlQ_iQnnEQpG";

// Lag Supabase-klient
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Når skjemaet sendes inn:
document.getElementById("coachForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const sport = document.getElementById("sport").value;
    const goal = document.getElementById("goal").value;
    const hours = document.getElementById("hours").value;

    // Vis tekst på siden
    const output = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;
    document.getElementById("result").textContent = output;

    // Lagre i Supabase
    const { data, error } = await db
        .from("form_submissions")
        .insert([
            { sport: sport, goal: goal, hours_per_week: Number(hours) }
        ]);

    if (error) {
        console.error("Feil ved lagring:", error);
        alert("Noe gikk galt med lagringen i Supabase.");
    } else {
        console.log("Lagret:", data);
    }
});


