let board = [];
let rows = 8;
let columns = 8;

let minesCount = 5;
let minesLocation = []; // '2-2', '3-4', etc

let tilesClicked = 0; //goal is to click all tiles except mine tiles
let flagEnabled = false;

let gameOver = false;

window.onload = function () {
  startGame();
};

function setMines() {
  let minesLeft = minesCount;

  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft--;
    }
  }
}

function startGame() {
  document.getElementById("minesCount").innerText = minesCount;
  document.getElementById("flagButton").addEventListener("click", setFlag);
  setMines();

  // populate the board
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // <div id='0-0'></div>
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("click", clickTile);
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
  console.log(board);
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flagButton").style.backgroundColor = "lightgray";
  } else {
    flagEnabled = true;
    document.getElementById("flagButton").style.backgroundColor = "darkgray";
  }
}

function clickTile() {
  if (gameOver || this.classList.contains("tileClicked")) return;

  let tile = this;
  if (flagEnabled) {
    if (tile.innerText === "") {
      tile.innerText = "🚩";
    } else if (tile.innerText === "🚩") {
      tile.innerText = "";
    }
    return;
  }

  if (minesLocation.includes(tile.id)) {
    // alert("Game Over");
    revealMines();
    gameOver = true;
    return;
  }

  let coords = tile.id.split("-"); // '1-1' -> ['1', '1']
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }

  if (board[r][c].classList.contains("tileClicked")) {
    return;
  }

  board[r][c].classList.add("tileClicked");
  tilesClicked += 1;

  let minesFound = 0;

  // check 3 tiles above clicked tile
  minesFound += checkTile(r - 1, c - 1); // top left
  minesFound += checkTile(r - 1, c); // top middle
  minesFound += checkTile(r - 1, c + 1); // top right
  // check left and right of clicked tile
  minesFound += checkTile(r, c - 1); // left
  minesFound += checkTile(r, c + 1); // right
  // check 3 tiles below clicked tile
  minesFound += checkTile(r + 1, c - 1); // bottom left
  minesFound += checkTile(r + 1, c); // bottom middle
  minesFound += checkTile(r + 1, c + 1); // bottom right

  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x" + minesFound.toString());
  } else {
    // When no mines are found
    // check above 3 tiles of clicked
    checkMine(r - 1, c - 1); // top left
    checkMine(r - 1, c); // top middle
    checkMine(r - 1, c + 1); // top right
    // check left and right of clicked tile
    checkMine(r, c - 1); // left
    checkMine(r, c + 1); // right
    // check 3 tiles below clicked tile
    checkMine(r + 1, c - 1); // bottom left
    checkMine(r + 1, c); // bottom middle
    checkMine(r + 1, c + 1); // bottom right
  }

  // Check for win
  if (tilesClicked === rows * columns - minesCount) {
    document.getElementById("minesCount").innerText = "Cleared";
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }
  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
