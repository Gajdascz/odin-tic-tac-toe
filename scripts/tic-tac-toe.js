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
      displayController.updateBoardDisplay(movePosition);
      gameController.checkResult();
      return true;
    } else { return false; }
  }

  return { getBoard, makeMove, initBoard };
})();
// createPlayer Factory Function
const createPlayer = (playerName, playerGamePiece, playerType, selectedDifficulty) => {
  const name = playerName;
  const gamePiece = playerGamePiece;
  const type = playerType;
  const difficulty = selectedDifficulty;
  const wins = 0;
  const losses = 0;
  const moves = 0;
  return { name, gamePiece, playerType, difficulty, wins, losses, moves };
}

// playerOptionsController IIFE Module Object
const playerOptionsController = (() => {
  const gamePlayers = [];
  const loadDialog = document.querySelector(`#information-options-dialog`);
  loadDialog.showModal();

  const openOptionsMenu = () => {
    loadDialog.showModal();
  }

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
    gameController.updateActiveGamePlayers(gamePlayers);
    gameController.startNewGame();
    displayController.updateTurnDisplay(gameController.getCurrentPlayer().name);
    playerSessionController.initInfoDisplay(gamePlayers);
    gameController.getCurrentPlayer().playerType === `computer` ? computerAI.makeAIMove(gameController.getCurrentPlayer()) : ``;
    loadDialog.close();
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
  return { openOptionsMenu };
})();

// displayController IIFE Module Object
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
      if(gameController.checkMove(movePosition)) {
        updateBoardDisplay(movePosition);
      }
    });
  });

  const updateBoardDisplay = (movePosition) => {
    const cell = gameBoardDisplay.querySelector(`[data-row="${movePosition[0]}"][data-column="${movePosition[1]}"]`);
    cell.textContent = currentBoard[movePosition[0]][movePosition[1]];
    }

  const playerOptionsButton = document.querySelector(`.player-options-button`);
  playerOptionsButton.addEventListener((`click`), (e) => {
    playerOptionsController.openOptionsMenu();
  });

  const turnDisplay = document.querySelector(`h2.turn-display`);
  const updateTurnDisplay = (currentPlayer) => turnDisplay.textContent = `${currentPlayer}'s Turn`;
  

   const clearBoardDisplay = () => {
    boardCells.forEach((cell) => {
      cell.textContent = ``;
    });
   }
  return  { updateTurnDisplay, 
            updateBoardDisplay, 
            clearBoardDisplay 
          };
})();

// endRoundController IIFE Module
const endRoundDialog = (() => { 

  const endRoundDialog = document.querySelector(`dialog#end-round-dialog`);
  const resultDisplay = endRoundDialog.querySelector(`.end-round-result`);
  const openEndRoundDialog = (result) => {
    endRoundDialog.showModal();
    if(result === `Tie`) resultDisplay.textContent = result;
    else result ? resultDisplay.textContent = `${result} Wins!` : resultDisplay.textContent = `Sneaky Insubordinate`;
  }

  const playAgainButton = endRoundDialog.querySelector(`.end-round-play-again-button`);
  playAgainButton.addEventListener((`click`), (e) => {
    endRoundDialog.close();
    gameController.startNewGame();
  });

  const openOptionsButton = endRoundDialog.querySelector(`.end-round-open-options-button`);
  openOptionsButton.addEventListener((`click`), (e) => {
    endRoundDialog.close();
    playerOptionsController.openOptionsMenu();
  });

  endRoundDialog.addEventListener((`cancel`), (e) => {
    e.preventDefault();
  });
  return { openEndRoundDialog }
 })();

// playerSessionController IIFE Module
const playerSessionController = (() => {
  const playerOneSessionContainer = document.querySelector(`.player-one-session`);
  const playerTwoSessionContainer = document.querySelector(`.player-two-session`);
  const p1SessionName = playerOneSessionContainer.querySelector(`.p1-session-name`);
  const p1SessionType = playerOneSessionContainer.querySelector(`.p1-session-type`);
  const p1SessionDifficulty = playerOneSessionContainer.querySelector(`.p1-session-difficulty`);
  const p1SessionPiece = playerOneSessionContainer.querySelector(`.p1-session-gp`);
  const p1Wins = playerOneSessionContainer.querySelector(`.p1-session-wins`);
  const p1Losses = playerOneSessionContainer.querySelector(`.p1-session-losses`);
  const p1Moves = playerOneSessionContainer.querySelector(`.p1-session-moves`);

  const p2SessionName = playerTwoSessionContainer.querySelector(`.p2-session-name`);
  const p2SessionType = playerTwoSessionContainer.querySelector(`.p2-session-type`);
  const p2SessionDifficulty = playerTwoSessionContainer.querySelector(`.p2-session-difficulty`);
  const p2SessionPiece = playerTwoSessionContainer.querySelector(`.p2-session-gp`);
  const p2Wins = playerTwoSessionContainer.querySelector(`.p2-session-wins`);
  const p2Losses = playerTwoSessionContainer.querySelector(`.p2-session-losses`);
  const p2Moves = playerTwoSessionContainer.querySelector(`.p2-session-moves`);


  const sessionTotalsContainer = document.querySelector(`.session-totals`);
  const totalTies = sessionTotalsContainer.querySelector(`.session-total-ties`);
  const totalGames = sessionTotalsContainer.querySelector(`.session-total-games`);
  const totalMoves = sessionTotalsContainer.querySelector(`.session-total-moves`);

  let ties = 0;

  const initInfoDisplay = (gamePlayers) => {
    const p1 = gamePlayers[0];
    const p2 = gamePlayers[1];


    p1SessionName.textContent = p1.name;
    p1SessionType.textContent = p1.playerType;
    p1.playerType === `computer` ? p1SessionDifficulty.textContent = `(${p1.difficulty})` : ``;
    p1SessionPiece.textContent = ` - [${p1.gamePiece}]`;

    p2SessionName.textContent = p2.name;
    p2SessionType.textContent = p2.playerType;
    p2.playerType === `computer` ? p2SessionDifficulty.textContent = `(${p2.difficulty})` : ``;
    p2SessionPiece.textContent = ` - [${p2.gamePiece}]`;
    ties = 0;
    updateSessionInfo(gamePlayers);
  }

  const updateSessionInfo = (gamePlayers) => {
    const p1 = gamePlayers [0];
    const p2 = gamePlayers [1];
    const games = +p1.wins + +p1.losses + +ties;
    const moves = +p1.moves + +p2.moves; 
    
    p1Wins.textContent = p1.wins;
    p1Losses.textContent = p1.losses;
    p1Moves.textContent = p1.moves;

    p2Wins.textContent = p2.wins;
    p2Losses.textContent = p2.losses;
    p2Moves.textContent = p2.moves;

    totalTies.textContent = ties;
    totalGames.textContent = games;
    totalMoves.textContent = moves;
  }

  const incrementMoves = (player) => {
    player.moves++;
  }
  const incrementWins = (player) => {
    player.wins++;
  }
  const incrementLosses = (player) => {
    player.losses++;
  }
  const incrementTies = () => {
    ties++;
  }
  return { initInfoDisplay, updateSessionInfo, incrementMoves, incrementWins, incrementLosses, incrementTies };
})();

// gameController IIFE Module Object
const gameController = (() => {
  const activeGamePlayers = [];
  let currentPlayer = null;
  let inactivePlayer = null;
  const updateActiveGamePlayers = (gamePlayers) => {
    currentPlayer = Math.floor(Math.random()*gamePlayers.length) === 0 ? gamePlayers[0] : gamePlayers[1];
    activeGamePlayers.length = 0;
    activeGamePlayers.push(gamePlayers[0], gamePlayers[1]);
  }
  const updateCurrentPlayer = () => {
    currentPlayer === activeGamePlayers[0] ? (currentPlayer = activeGamePlayers[1], inactivePlayer = activeGamePlayers[0]) : (currentPlayer = activeGamePlayers[0], inactivePlayer = activeGamePlayers[1]);
    displayController.updateTurnDisplay(currentPlayer.name);
    currentPlayer.playerType === `computer` ? computerAI.makeAIMove(currentPlayer) : ``;
  }
  const getActiveGamePlayers = () => activeGamePlayers;
  const getCurrentPlayer = () => currentPlayer;
  const getInactivePlayer = () => inactivePlayer;


  const randomizeFirstTurn = () => {
    currentPlayer = Math.floor(Math.random()*activeGamePlayers.length) === 0 ? activeGamePlayers[0] : activeGamePlayers[1];
  }
  const checkMove = (movePosition) => {
    if(!gameBoard.makeMove(movePosition)) {
      alert(`${gameController.getCurrentPlayer().name}, please select an open spot.`)
      return false;
    } else { 
      gameBoard.makeMove(movePosition);
      playerSessionController.incrementMoves(getCurrentPlayer());
      playerSessionController.updateSessionInfo(getActiveGamePlayers());
      !checkBoard() ? updateCurrentPlayer() : ``;
      displayController.updateTurnDisplay(currentPlayer.name);
      return true;
    }
  }
// checkBoard: Checks for 3 in a row or tie. Returns result (true if match or tie, false if not).
//#region 
  const checkBoard = () => {
    let result = false;
    const currentBoard = gameBoard.getBoard();
    const checkTie = (board) => {
      return (
        !board[0].includes(null) &&
        !board[1].includes(null) &&
        !board[2].includes(null)
      
      ); 
    }
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
      checkTie(currentBoard)        ? result = `tie` : false;
      checkRow(currentBoard, i)     ? result = true  : false;
      checkColumn(currentBoard, i)  ? result = true  : false;
      checkDiagonal(currentBoard)   ? result = true  : false;
    }
    return result;
  }
//#endregion
  const checkResult = () => {
    if(checkBoard()) {
      const result = gameController.checkBoard() === `tie` ?  `Tie` : currentPlayer.name;
      if (result === `Tie`) playerSessionController.incrementTies(); 
      else playerSessionController.incrementWins(currentPlayer), playerSessionController.incrementLosses(inactivePlayer); 
      playerSessionController.updateSessionInfo(gameController.getActiveGamePlayers());
      endRoundDialog.openEndRoundDialog(result);
    }
  }

  const startNewGame = () => {
    displayController.clearBoardDisplay();
    gameBoard.initBoard();
    randomizeFirstTurn();
    currentPlayer.playerType === `computer` ? computerAI.makeAIMove(currentPlayer) : ``;
  }
  return { 
    updateActiveGamePlayers,
    randomizeFirstTurn,
    getActiveGamePlayers, 
    getCurrentPlayer, 
    getInactivePlayer, 
    updateCurrentPlayer, 
    checkBoard,
    checkMove,
    checkResult,
    startNewGame 
  };
})();

const computerAI = (() => {
  const availableMoves = [];
  const makeAIMove = (player) => {
    switch(player.difficulty) {
      case `easy`:
        getAvailableMoves();
        availableMoves.length > 0 ? easyMove() : ``;
        break;
      case `medium`:
        break;
      case `hard`:
        break;
      case `impossible`:
        break;
    }
  }
  const getAvailableMoves = () => {
    availableMoves.length = 0;
    const currentBoard = gameBoard.getBoard();
    for(let i = 0; i < currentBoard.length; i++){
      for(let j = 0; j < currentBoard[i].length; j++){
        currentBoard[i][j] === null ? availableMoves.push([i,j]) : ``; 
      }
    }
  }
  const easyMove = () => {
    const randomMovePos = availableMoves[Math.floor(Math.random()*availableMoves.length)];
    gameController.checkMove(randomMovePos);
  }
  return { makeAIMove };
})();
