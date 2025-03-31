// DOM elements
const startGameBtn = document.getElementById("startGame");
const moodBtns = document.querySelectorAll(".mood-btn");
const intensitySlider = document.getElementById("intensity");
const sliderLabel = document.getElementById("sliderLabel");
const eventDesc = document.getElementById("eventDesc");
const submitEventBtn = document.getElementById("submitEvent");
const addMoreBtn = document.getElementById("addMore");

const startScreen = document.getElementById("start-screen");
const moodScreen = document.getElementById("mood-screen");
const intensityScreen = document.getElementById("intensity-screen");
const scoreboardScreen = document.getElementById("scoreboard-screen");

const intensityPrompt = document.getElementById("intensityPrompt");
const p1ScoreText = document.getElementById("p1Score");
const p2ScoreText = document.getElementById("p2Score");
const p1NameLog = document.getElementById("p1NameLog");
const p2NameLog = document.getElementById("p2NameLog");
const winnerBox = document.getElementById("finalWinner");

const p1TableBody = document.querySelector("#p1Table tbody");
const p2TableBody = document.querySelector("#p2Table tbody");

// Game state
let playerOne = "";
let playerTwo = "";
let currentMood = "";
let p1Score = 0;
let p2Score = 0;
let logs = [];

// Witty feedback
const wittyComments = {
  happy: [
    "They did good. Give 'em that love boost! 💖",
    "Pookie on their best behavior today? Cute. 💅",
    "A 10? You sure you’re not getting proposed to? 💍"
  ],
  mad: [
    "Yikes. Emotional damage detected. 🥲",
    "Rage meter rising... deduct points! 😤",
    "Oof. Someone’s sleeping on the couch tonight 🛋️"
  ]
};

// Switch screen helper
function switchScreen(hide, show) {
  hide.classList.add("hidden");
  show.classList.remove("hidden");
}

// Save state to localStorage
function saveState() {
  const data = {
    playerOne,
    playerTwo,
    p1Score,
    p2Score,
    logs
  };
  localStorage.setItem("rageRomanceData", JSON.stringify(data));
}

// Load from localStorage
function loadState() {
  const saved = localStorage.getItem("rageRomanceData");
  if (!saved) return;

  const data = JSON.parse(saved);
  playerOne = data.playerOne;
  playerTwo = data.playerTwo;
  p1Score = data.p1Score;
  p2Score = data.p2Score;
  logs = data.logs;

  // Update UI
  p1NameLog.textContent = playerOne;
  p2NameLog.textContent = playerTwo;
  p1ScoreText.textContent = `${playerOne}: ${p1Score}`;
  p2ScoreText.textContent = `${playerTwo}: ${p2Score}`;
  logs.forEach(log => renderLog(log));
  updateWinner();
  switchScreen(startScreen, scoreboardScreen);
}

// Render a log entry
function renderLog(log) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${log.date}</td>
    <td>${log.description}</td>
    <td>${log.mood.toUpperCase()}</td>
    <td>${log.score > 0 ? "+" : ""}${log.score}</td>
  `;
  if (log.target === "p1") {
    p1TableBody.appendChild(row);
  } else {
    p2TableBody.appendChild(row);
  }
}

// Update the final winner verdict
function updateWinner() {
  const diff = p1Score - p2Score;
  let msg = "";

  if (diff > 0) {
    msg = `🏆 ${playerOne} is currently winning the love war!`;
  } else if (diff < 0) {
    msg = `🏆 ${playerTwo} is on top right now — emotionally speaking!`;
  } else {
    msg = `⚔️ It's a tie! A perfectly balanced relationship.`;
  }

  winnerBox.textContent = msg;
  winnerBox.classList.remove("hidden");
}

// Start game
startGameBtn.addEventListener("click", () => {
  playerOne = document.getElementById("playerOne").value.trim();
  playerTwo = document.getElementById("playerTwo").value.trim();

  if (!playerOne || !playerTwo) {
    alert("Both names are required!");
    return;
  }

  p1NameLog.textContent = playerOne;
  p2NameLog.textContent = playerTwo;
  p1ScoreText.textContent = `${playerOne}: 0`;
  p2ScoreText.textContent = `${playerTwo}: 0`;

  saveState(); // save initial names
  switchScreen(startScreen, moodScreen);
});

// Mood selection
moodBtns.forEach(button => {
  button.addEventListener("click", () => {
    currentMood = button.dataset.mood;
    intensityPrompt.textContent = currentMood === "happy"
      ? "How awesome was their move? 💖"
      : "How mad are you right now? 😤";
    sliderLabel.textContent = `Intensity: ${intensitySlider.value}`;
    eventDesc.value = "";
    switchScreen(moodScreen, intensityScreen);
  });
});

// Slider live label
intensitySlider.addEventListener("input", () => {
  sliderLabel.textContent = `Intensity: ${intensitySlider.value}`;
});

// Submit a log
submitEventBtn.addEventListener("click", () => {
  const intensity = parseInt(intensitySlider.value);
  const description = eventDesc.value.trim();
  const date = new Date().toLocaleDateString();

  if (!description) {
    alert("Please add a short description!");
    return;
  }

  const score = currentMood === "happy" ? intensity : -intensity;
  const log = {
    date,
    description,
    mood: currentMood,
    score,
    target: "p2"
  };

  logs.push(log);
  renderLog(log);

  // Update score
  if (log.target === "p2") {
    p2Score += score;
    p2ScoreText.textContent = `${playerTwo}: ${p2Score}`;
  }

  // Random witty comment
  const comments = wittyComments[currentMood];
  const msg = comments[Math.floor(Math.random() * comments.length)];
  alert(msg);

  updateWinner();
  saveState();
  switchScreen(intensityScreen, scoreboardScreen);
});

// Add another entry
addMoreBtn.addEventListener("click", () => {
  switchScreen(scoreboardScreen, moodScreen);
});

// Load everything on page load
window.addEventListener("load", loadState);


