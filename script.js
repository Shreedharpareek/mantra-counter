// State
let count = Number(localStorage.getItem("count")) || 0;
let target = Number(localStorage.getItem("target")) || 108;
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let isDarkMode = localStorage.getItem("darkMode") === "true";

// DOM
const countEl = document.getElementById("count");
const targetEl = document.getElementById("current-target");
const progressFill = document.getElementById("progress-fill");
const historyList = document.getElementById("history-list");
const themeBtn = document.getElementById("theme-btn");

// Audio (create ONCE)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Current session
let currentSession = {
    start: new Date().toISOString(),
    count: 0
};

// Theme restore
if (isDarkMode) {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
}

// Functions
function updateUI() {
    countEl.textContent = count;
    targetEl.textContent = target;
    progressFill.style.width = `${Math.min((count / target) * 100, 100)}%`;
}

function saveData() {
    localStorage.setItem("count", count);
    localStorage.setItem("target", target);
    localStorage.setItem("sessions", JSON.stringify(sessions));
}

function playSound() {
    const osc = audioCtx.createOscillator();
    osc.frequency.value = 440;
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function renderHistory() {
    historyList.innerHTML = sessions.length
        ? sessions.map(s =>
            `<div>📅 ${new Date(s.start).toLocaleDateString()} — ${s.count}</div>`
          ).join("")
        : "<p>No sessions yet</p>";
}

// Events
document.getElementById("increment").onclick = () => {
    count++;
    currentSession.count++;
    playSound();
    updateUI();
    saveData();
};

document.getElementById("decrement").onclick = () => {
    if (count > 0) {
        count--;
        currentSession.count--;
        updateUI();
        saveData();
    }
};

document.getElementById("reset").onclick = () => {
    count = 0;
    currentSession.count = 0;
    updateUI();
    saveData();
};

document.getElementById("new-session").onclick = () => {
    currentSession.end = new Date().toISOString();
    sessions.push(currentSession);
    currentSession = { start: new Date().toISOString(), count: 0 };
    count = 0;
    updateUI();
    saveData();
};

document.getElementById("set-target").onclick = () => {
    const val = Number(document.getElementById("target").value);
    if (val > 0) {
        target = val;
        updateUI();
        saveData();
    }
};

document.getElementById("toggle-history").onclick = () => {
    historyList.classList.toggle("hidden");
    renderHistory();
};

document.getElementById("help-toggle").onclick = () => {
    document.getElementById("help-content").classList.toggle("hidden");
};

themeBtn.onclick = () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDarkMode);
    themeBtn.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
};

// Init
updateUI();
renderHistory();
