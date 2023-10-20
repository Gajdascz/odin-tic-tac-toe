// You’re going to store the gameboard as an array inside of a Gameboard object, so start there!
const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];

  for(let i = 0; i < rows; i++) {
    boardArray[i] = [];
    for(let j = 0; j < columns; j++) {
      boardArray[i].push(null);
    }
  }
  const getBoard = () => boardArray;
  const makeMove = (movePosition) => {
    !boardArray[movePosition[0]][movePosition[1]] ? boardArray[movePosition[0]][movePosition[1]] = `X` : alert(`Please choose an open spot!`);
    console.log(boardArray);
  }
  return { getBoard, makeMove };
})();

// Your players are also going to be stored in objects,
const createPlayer = (playerName, playerGamePiece) => {
  const name = playerName;
  const gamePiece = playerGamePiece;

  return { name, gamePiece };
}
const gameController = (() => {
  const playerOne = createPlayer(`Nolan`,`X`);
  const playerTwo = createPlayer(`Kayla`,`O`);
  const gamePlayers = { playerOne, playerTwo };


  console.log(gamePlayers);
})();

const  displayController = (() => {
  const loadDialog = document.querySelector(`#information-options-dialog`);
  loadDialog.showModal();
  const currentBoard = gameBoard.getBoard();
  const gameBoardDisplay = document.querySelector(`.game-board-container`);
  for(let i = 0; i < currentBoard.length; i++) { 
    const boardRowDiv = document.createElement(`div`);
    boardRowDiv.setAttribute(`class`, `game-board-row-${i+1}`);
    for(let j = 0; j < currentBoard[i].length; j++) {
      const boardRowCell = document.createElement(`button`);
      boardRowCell.classList.add(`game-board-cell`, `game-board-column-${j+1}`);
      boardRowCell.setAttribute(`type`, `button`);
      boardRowCell.setAttribute(`data-row`, `${i}`);
      boardRowCell.setAttribute(`data-column`, `${j}`);
      boardRowDiv.append(boardRowCell);
      gameBoardDisplay.append(boardRowDiv);
    }
  }
  const boardCells = document.querySelectorAll(`[data-row]`);
  boardCells.forEach((cell) => {
    cell.addEventListener((`click`), (e) => {
      const movePosition = [cell.getAttribute(`data-row`), cell.getAttribute(`data-column`)];
      gameBoard.makeMove(movePosition);
    });
  });
    const typeDifficultySelect = document.querySelectorAll(`.type-difficulty-container`);
    typeDifficultySelect.forEach((container, index ) => {
      container.addEventListener((`change`), (e) => {
        const typeSelected = container.querySelector(`select.player-type-select`).value;
        console.log(typeSelected);
        typeSelected === `computer` ? container.querySelector(`select.difficulty-select`).setAttribute(`disabled`, `true`) : container.querySelector(`select.difficulty-select`).removeAttribute(`disabled`);

      });
    });
})();





// and you’re probably going to want an object to control the flow of the game itself.
      // Your main goal here is to have as little global code as possible. 
      // Try tucking everything away inside of a module or factory. 
      // Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.




      // Game starts, random player is chosen to go first.
      // chosen first player picks an spot on the gameboard
        // If the spot is empty, place their game piece. If the spot is taken, do nothing or tell them to choose another space
      // repeat for second player until there's a win or tie.