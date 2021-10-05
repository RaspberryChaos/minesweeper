const boardSize = 6;
const numberMines = 4;
let minesLeft = numberMines;

const tileType = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

const gameBoard = document.getElementById("board");
gameBoard.style.setProperty("--size", boardSize);

const minePositions = getMinePositions(boardSize, numberMines);

const message = document.getElementById("message");
message.textContent = `Mines Left: ${minesLeft}`;


/**
 * Creates a new game board
 *
 * @param {number} size The number of squares on the board (horizontically and vertically).
 * @param {number} numMines The number of mines on the board
 * @return {array} The new game board as an array of objects with a div element, x + y coordinates, and mine positions.
 */

function createBoard(size, numMines) {
  const board = [];
  for (let x = 0; x < size; x++) {
    const row = [];
    for (let y = 0; y < size; y++) {
      const element = document.createElement("div");
      element.dataset.status = tileType.HIDDEN;
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

const board = createBoard(boardSize, numberMines);

board.forEach((row) => {
  row.forEach((tile) => {
    gameBoard.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameOver();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
    });
  });
});


/**
 * Randomly positions mines on the game board.
 *
 * @param {number} boardSize The number of squares on the board (horizontically and vertically).
 * @param {number} numberOfMines The number of mines to be generated.
 * @return {array} An array containing the positions of all the mines.
 */

function getMinePositions(boardSize, numberOfMines) {
  const positions = [];
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }
  return positions;
}


/**
 * Generates a random number between 0 and size argument.
 *
 * @param {number} size The maximum number to be generated.
 * @return {number} Returns an integer between 0 and size argument.
 */

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}


/**
 * Compares position a to position b and returns true if they match.
 *
 * @param {object} a The position of the first object.
 * @param {object} b The position of the second object.
 * @return {boolean} Returns true if position a and position b match.
 */

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}


/**
 * Checks if a tile is marked as a mine or not, updates its status and updates the number of mines left.
 *
 * @param {object} tile The tile to be checked.
 * @return {void} Returns nothing.
 */

function markTile(tile) {
  if (tile.status !== tileType.HIDDEN && tile.status !== tileType.MARKED) {
    return;
  }

  if (tile.status === tileType.MARKED) {
    tile.status = tileType.HIDDEN;
    minesLeft++;
  } else {
    tile.status = tileType.MARKED;
    minesLeft--;
  }
  message.textContent = `Mines Left: ${minesLeft}`;
}


/**
 * Reveals the tiles.
 *
 * @param {array} board The game board.
 * @param {object} tile The tile that was clicked.
 * @return {void} Returns nothing.
 */

function revealTile(board, tile) {
  if (tile.status !== tileType.HIDDEN) return;
  if (tile.mine) {
    tile.status = tileType.MINE;
    return;
  } else {
    tile.status = tileType.NUMBER;
    const adjacent = nearbyTiles(board, tile);
    const mines = adjacent.filter((tile) => tile.mine);
    if (mines.length === 0) {
      adjacent.forEach(revealTile.bind(null, board));
    } else {
      tile.element.textContent = mines.length;
    }
  }
}


/**
 * Returns an array of the adjacent tiles
 *
 * @param {array} board The game board.
 * @param {object} {x,y} The x and y coordinates of the current tile.
 * @return {array} Returns an array of the tiles adjacent to the current tile.
 */

function nearbyTiles(board, { x, y }) {
  const tiles = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const tile = board[x + i]?.[y + j];
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
}


/**
 * Checks for game over.
 * 
 * @return {void} Returns nothing.
 */

function checkGameOver() {
    let win = checkWin(board);
    let lose = checkLose(board);

    if(win || lose) {
        gameBoard.addEventListener("click", stopProp, {capture: true});
        gameBoard.addEventListener("contextmenu", stopProp, {capture: true});
    }

    if(win) {
        message.textContent = "You Win!";
    }
    if(lose) {
        message.textContent = "You Lose!";
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === tileType.MARKED) markTile(tile);
                if(tile.mine) revealTile(board, tile);
            })     
        })
    }
}


/**
 * Prevents event listeners on tiles being called if game over.
 *
 * @param {event} e
 * @return {void} Returns nothing
 */

function stopProp(e) {
    e.stopImmediatePropagation();
}


/**
 * Checks if the game is been won.
 *
 * @param {array} board The game board.
 * @return {boolean} Returns true if the game has been won, false if not.
 */

function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === tileType.NUMBER || 
                (tile.mine && (tile.status === tileType.MARKED || tile.status === tileType.HIDDEN))
            ) 
        })
    })
};


/**
 * Checks if the game is been lost.
 *
 * @param {array} board The game board.
 * @return {boolean} Returns true if the game has been lost, false if not.
 */

function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === tileType.MINE;
        })
    })
};