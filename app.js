const tileType = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

const boardSize = 8;
const numberMines = 4;

const gameBoard = document.getElementById("board");
gameBoard.style.setProperty("--size", boardSize);

function createBoard(size, numMines) {
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const element = document.createElement("div");
      element.dataset.status = tileType.HIDDEN;
      const tile = {
        element,
        x: i,
        y: j,
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
