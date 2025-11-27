// Når skjemaet sendes inn:
document.getElementById("coachForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Hindrer at siden refresher

    const sport = document.getElementById("sport").value;
    const goal = document.getElementById("goal").value;
    const hours = document.getElementById("hours").value;

    // Lag en enkel tekst basert på det brukeren har skrevet
    const output = `Takk! Du trener ${sport}, målet ditt er "${goal}", og du trener ${hours} timer per uke.`;

    // Vis teksten under skjemaet
    document.getElementById("result").textContent = output;
});
