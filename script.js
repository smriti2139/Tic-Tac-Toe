const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const difficultySelect = document.getElementById("difficulty");
const clickSound = new Audio("mouse-click-153941.mp3");
const winSound = new Audio("success-1-6297.mp3");
const drawSound = new Audio("interface-124464.mp3");

let board = Array(9).fill("");
let human = "O";
let ai = "X";
let gameOver = false;

let soundEnabled = true;
let humanScore = 0;
let aiScore = 0;
let drawScore = 0;

// 🔹 Draw the board
function drawBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = val;
    if (val !== "" || gameOver) {
      cell.classList.add("disabled");
    } else {
      cell.addEventListener("click", () => handleMove(i, human));
    }
    boardEl.appendChild(cell);
  });
}

// 🔹 Handle moves
function handleMove(index, player) {
  if (board[index] !== "" || gameOver) return;

  board[index] = player;
  if (soundEnabled) clickSound.play();
  drawBoard();

  const winPattern = checkWin(board, player);
  if (winPattern) {
    statusEl.innerText = `${player} wins!`;
    gameOver = true;
    highlightWinningCells(winPattern);
    if (soundEnabled) winSound.play();
    if (player === human) humanScore++;
    else aiScore++;
    updateScore();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusEl.innerText = "It's a draw!";
    gameOver = true;
    if (soundEnabled) drawSound.play();
    drawScore++;
    updateScore();
    return;
  }

  if (player === human) {
    let bestMove = difficultySelect.value === "easy"
      ? getRandomMove(board)
      : minimax(board, ai).index;
    handleMove(bestMove, ai);
  }
}

// 🔹 Highlight winning cells
function highlightWinningCells(pattern) {
  const cells = document.querySelectorAll(".cell");
  pattern.forEach(index => {
    cells[index].classList.add("win");
  });
}

// 🔹 Check winner
function checkWin(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.find(pattern =>
    pattern.every(index => board[index] === player)
  ) || null;
}

// 🔹 Minimax algorithm
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, i) => val === "" ? i : null)
    .filter(i => i !== null);

  if (checkWin(newBoard, human)) return { score: -10 };
  if (checkWin(newBoard, ai)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let index of availSpots) {
    const move = { index };
    newBoard[index] = player;
    const result = minimax(newBoard, player === ai ? human : ai);
    move.score = result.score;
    newBoard[index] = "";
    moves.push(move);
  }

  return player === ai
    ? moves.reduce((best, move) => move.score > best.score ? move : best)
    : moves.reduce((best, move) => move.score < best.score ? move : best);
}

// 🔹 Easy AI
function getRandomMove(board) {
  const available = board
    .map((val, i) => val === "" ? i : null)
    .filter(i => i !== null);
  const randIndex = Math.floor(Math.random() * available.length);
  return available[randIndex];
}

// 🔹 Restart with countdown
function restartGame() {
  let countdown = 3;
  statusEl.innerText = `Restarting in ${countdown}...`;
  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      statusEl.innerText = `Restarting in ${countdown}...`;
    } else {
      clearInterval(interval);
      board = Array(9).fill("");
      gameOver = false;
      statusEl.innerText = "";
      drawBoard();
    }
  }, 1000);
}

// 🔹 Score updater
function updateScore() {
  document.getElementById("humanScore").innerText = humanScore;
  document.getElementById("aiScore").innerText = aiScore;
  document.getElementById("drawScore").innerText = drawScore;
}

// 🔹 Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("darkModeBtn");
  btn.innerText = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// 🔹 Sound mute toggle
function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById("muteBtn").innerText = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
}

// 🔹 Init game
window.onload = () => {
  drawBoard();
  updateScore();
};
