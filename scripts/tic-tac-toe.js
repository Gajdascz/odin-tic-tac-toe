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
const createPlayer = (playerName, playerGamePiece, playerType, selectedDifficulty) => {
  const name = playerName;
  const gamePiece = playerGamePiece;
  const type = playerType;
  const difficulty = selectedDifficulty;
  return { name, gamePiece, playerType, difficulty };
}


const  displayController = (() => {
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
})();


const playerOptionsController = (() => {
  const gamePlayers = [];

  const loadDialog = document.querySelector(`#information-options-dialog`);
  loadDialog.showModal();

  const playerInformationSubmit = document.querySelector(`.information-submit-button`);
  playerInformationSubmit.addEventListener((`click`), (e) => {
    const playerOne = createPlayer(
      loadDialog.querySelector(`input#player-one-name`).value.trim() === `` ? 'enigma' : loadDialog.querySelector(`input#player-one-name`).value.trim(),
      loadDialog.querySelector(`input#player-one-game-piece`).value.trim() === `` ? `?` : loadDialog.querySelector(`input#player-one-game-piece`).value.trim(),
      loadDialog.querySelector(`select#player-one-type`).value,
      loadDialog.querySelector(`select#player-one-difficulty`).value
    );
    const playerTwo = createPlayer(
      loadDialog.querySelector(`input#player-two-name`).value.trim() === `` ? 'amgine' : loadDialog.querySelector(`input#player-two-name`).value.trim(),
      loadDialog.querySelector(`input#player-two-game-piece`).value.trim() === `` ? `¿` : loadDialog.querySelector(`input#player-two-game-piece`).value.trim(),
      loadDialog.querySelector(`select#player-two-type`).value,
      loadDialog.querySelector(`select#player-two-difficulty`).value
    );
    gamePlayers.length = 0;
    gamePlayers.push(playerOne, playerTwo);
    gameController(gamePlayers);
    loadDialog.close()
  });

  const playerOptionsButton = document.querySelector(`.player-options-button`);
  playerOptionsButton.addEventListener((`click`), (e) => {
    loadDialog.showModal();
  });

  loadDialog.addEventListener((`cancel`), (e) => {
    e.preventDefault();
  });

  const typeDifficultySelect = document.querySelectorAll(`.type-difficulty-container`);
  typeDifficultySelect.forEach((container) => {
    container.addEventListener((`change`), (e) => {
      const typeSelected = container.querySelector(`select.player-type-select`).value;
      typeSelected === `human` ? container.querySelector(`select.difficulty-select`).setAttribute(`disabled`, `true`) : container.querySelector(`select.difficulty-select`).removeAttribute(`disabled`);
    });
  });
})();

const gameController = ((gamePlayers) => {
  console.log(gamePlayers);
});
