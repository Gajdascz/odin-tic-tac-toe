const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];

  const initBoard = (() => {
  for(let i = 0; i < rows; i++) {
    boardArray[i] = [];
    for(let j = 0; j < columns; j++) {
      boardArray[i].push(null);
    }
  }
});
  const getBoard = () => boardArray;
  const makeMove = (movePosition) => {
    if (!boardArray[movePosition[0]][movePosition[1]]) {
      boardArray[movePosition[0]][movePosition[1]] = gameController.getCurrentPlayer().gamePiece
      return true;
    } else { return false; }
  }
  const clearBoard = () => {
    boardArray.length = 0;
  }
  return { getBoard, makeMove, clearBoard, initBoard };
})();

const createPlayer = (playerName, playerGamePiece, playerType, selectedDifficulty) => {
  const name = playerName;
  const gamePiece = playerGamePiece;
  const type = playerType;
  const difficulty = selectedDifficulty;
  return { name, gamePiece, playerType, difficulty };
}

// #region
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
    loadDialog.close()
    gameController.updateActiveGamePlayers(gamePlayers)
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
  const getGamePlayers = () => gamePlayers; 
  const getFirstTurn = () => Math.floor(Math.random()*gamePlayers.length) === 0 ? gamePlayers[0] : gamePlayers[1];
  return { getGamePlayers, getFirstTurn };
})();
// #endregion

// #region
const  displayController = (() => {
  gameBoard.initBoard();
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
      !gameBoard.makeMove(movePosition) ? alert(`${gameController.getCurrentPlayer().name}, please select an open spot.`) : gameController.updateCurrentPlayer();
      console.log(gameController.checkBoard());
    });
  });
  const turnDisplay = document.querySelector(`h2.turn-display`);
  const updateTurnDisplay = (currentPlayer) => turnDisplay.textContent = `${currentPlayer}'s Turn`;
  return { updateTurnDisplay };
})();
// #endregion

const gameController = (() => {
  const activeGamePlayers = [];
  let currentPlayer = null;
  const updateActiveGamePlayers = (gamePlayers) => {
    activeGamePlayers.length = 0;
    activeGamePlayers.push(gamePlayers[0], gamePlayers[1]);
    currentPlayer = playerOptionsController.getFirstTurn();
  }
  const updateCurrentPlayer = () => currentPlayer === activeGamePlayers[0] ? currentPlayer = activeGamePlayers[1] : currentPlayer = activeGamePlayers[0];
  const getActiveGamePlayers = () => activeGamePlayers;
  const getCurrentPlayer = () => currentPlayer;

  const checkBoard = () => {
    let result = false;
    const currentBoard = gameBoard.getBoard();
    const checkRow = (board, row) => {
      return board[row].includes(null) ? false : (board[row][0] === board[row][1] && board[row][0] === board[row][2]);
    }
    const checkColumn = (board, column) => {
      return (
            board[0][column] === null ||
            board[1][column] === null ||
            board[2][column] === null ? 
            false : (board[0][column] === board[1][column] && board[0][column] === board[2][column])
            );
    }
    const checkDiagonal = (board) => {
      if(!board[1][1]) return false;
      else return (
                    (board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
                    (board[0][2] === board[1][1] && board[0][2] === board[2][0])
                  );
    }
    for(let i = 0; i < currentBoard.length; i++) {
      checkRow(currentBoard, i)     ? result = true : false;
      checkColumn(currentBoard, i)  ? result = true : false;
      checkDiagonal(currentBoard)   ? result = true : false;
    }
    return result;
  }
  return { updateActiveGamePlayers, getActiveGamePlayers, getCurrentPlayer, updateCurrentPlayer, checkBoard};
})();
