// You’re going to store the gameboard as an array inside of a Gameboard object, so start there!
const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];

  for(let i = 0; i < rows; i++) {
    boardArray[i] = [];
    for(let j = 0; j < columns; j++) {
      boardArray[i].push("cell");
      console.log(boardArray);
    }
  }
})();

const  displayController = (() => {

})();

const gameController = (() => {

})();

// Your players are also going to be stored in objects,
const createPlayer = (playerName, playerGamePiece) => {
  const name = playerName;
  const gamePiece = playerGamePiece;

  return { name, gamePiece };
}

// and you’re probably going to want an object to control the flow of the game itself.
      // Your main goal here is to have as little global code as possible. 
      // Try tucking everything away inside of a module or factory. 
      // Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.