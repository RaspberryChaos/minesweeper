const boardSize = 6;
const numberMines = 4;

const tileType = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

const gameBoard = document.getElementById("board");
gameBoard.style.setProperty("--size", boardSize);

const minePositions = getMinePositions(boardSize, numberMines);
console.log("mine positions", minePositions);

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
console.log(board);

board.forEach((row) => {
  row.forEach((tile) => {
    gameBoard.append(tile.element);
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
