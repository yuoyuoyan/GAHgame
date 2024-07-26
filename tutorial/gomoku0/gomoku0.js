const board = document.getElementById("board");
const resetButton = document.getElementById("reset-button");
const gridSize = 15; // 棋盘格子数
const cellSize = 40; // 棋盘格子大小（像素）
let currentPlayer = "player-one"; // 当前玩家
let gameOver = false; // 游戏结束标志

// 创建棋盘格子
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    }
}

// 处理格子点击事件
function handleCellClick(event) {
    if (gameOver) return;
    const cell = event.target;
    if (!cell.classList.contains("player-one") && !cell.classList.contains("player-two")) {
        cell.classList.add(currentPlayer);
        if (checkForWin(parseInt(cell.dataset.row), parseInt(cell.dataset.col))) {
            showWinMessage();
        } else {
            currentPlayer = currentPlayer === "player-one" ? "player-two" : "player-one";
        }
    }
}
// 显示胜利消息
function showWinMessage() {
    gameOver = true;
    alert(currentPlayer === "player-one" ? "玩家一获胜！" : "玩家二获胜！");
    
}

// 重新开始游戏
function resetGame() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.classList.remove("player-one", "player-two");
    });
    currentPlayer = "player-one";
    gameOver = false;
    // 在这里重置游戏状态
}

// 监听重新开始按钮点击事件
resetButton.addEventListener("click", resetGame);
// 在检查玩家胜利时，遍历棋盘上的每个格子
function checkForWin(row, col) {
    const currentPlayerClass = currentPlayer === "player-one" ? "player-one" : "player-two";
    // 检查水平方向
    if (
        checkDirection(row, col, 0, 1, currentPlayerClass) ||
        checkDirection(row, col, 0, -1, currentPlayerClass)
    ) {
        showWinMessage();
        return;
    }
    // 检查垂直方向
    if (
        checkDirection(row, col, 1, 0, currentPlayerClass) ||
        checkDirection(row, col, -1, 0, currentPlayerClass)
    ) {
        showWinMessage();
        return;
    }
    // 检查对角线方向
    if (
        checkDirection(row, col, 1, 1, currentPlayerClass) ||
        checkDirection(row, col, -1, -1, currentPlayerClass) ||
        checkDirection(row, col, 1, -1, currentPlayerClass) ||
        checkDirection(row, col, -1, 1, currentPlayerClass)
    ) {
        showWinMessage();
        return;
    }
}

// 检查指定方向上是否有连珠
function checkDirection(row, col, rowDelta, colDelta, currentPlayerClass) {
    let count = 0;
    for (let i = 0; i < 5; i++) {
        const newRow = row + i * rowDelta;
        const newCol = col + i * colDelta;
        if (
            newRow >= 0 &&
            newRow < gridSize &&
            newCol >= 0 &&
            newCol < gridSize &&
            document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`).classList.contains(currentPlayerClass)
        ) {
            count++;
        } else {
            break;
        }
    }
    return count >= 5;
}