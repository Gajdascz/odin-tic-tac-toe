
// Main gameBoard Module
// Methods: initBoard(), getBoard(), makeMove(), simulateMove(), undoMove() 
const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const boardArray = [];

  // Initializes 2D array
  const initBoard = (() => {
    for(let i = 0; i < rows; i++) {
      boardArray[i] = [];
      for(let j = 0; j < columns; j++) {
        boardArray[i].push(null);
      }
    }
  });

  // Returns gameBoard
  const getBoard = () => boardArray;

  // If cell is available makes the move with given gamePiece
  const makeMove = (movePosition, gamePiece) => {
    if (!boardArray[movePosition[0]][movePosition[1]]) {
      boardArray[movePosition[0]][movePosition[1]] = gamePiece
      return true;
    } else { return false; }
  }

  // makeMove except for use with AI
  const simulateMove = (board, movePosition, player) => {
      if(!board[movePosition[0]][movePosition[1]]) {
        board[movePosition[0]][movePosition[1]] = player.gamePiece;
        return true;
      } else { return false; }
    }
  // Remove gamePiece from cell
  const undoMove = (board, movePosition) => {
      board[movePosition[0]][movePosition[1]] = null;
  }
  return { getBoard, makeMove, initBoard, simulateMove, undoMove };
})();


// createPlayer Factory Function
// Properties: name, gamePiece, type, difficulty, wins, losses, moves, number
const createPlayer = (playerName, playerGamePiece, playerType, selectedDifficulty, playerNumber) => {
  const name = playerName;
  let gamePiece = playerGamePiece;
  const type = playerType;
  const difficulty = selectedDifficulty;
  const number = playerNumber;
  const wins = 0;
  const losses = 0;
  const moves = 0;
  return { name, gamePiece, type, difficulty, wins, losses, moves, number };
}

// playerOptionsController Module
// Initializes player information based on input from form
// Methods: openOptionsMenu()
const playerOptionsController = (() => {
  const gamePlayers = [];
  const loadDialog = document.querySelector(`#information-options-dialog`);
  loadDialog.showModal();
  const openOptionsMenu = () => {
    loadDialog.showModal();
  }

  // Submit event handler to apply input player information
  const playerInformationSubmit = document.querySelector(`.information-submit-button`);
  playerInformationSubmit.addEventListener((`click`), (e) => {
    const playerOne = createPlayer(
      loadDialog.querySelector(`input#player-one-name`).value.trim() === `` ? 'enigma' : loadDialog.querySelector(`input#player-one-name`).value.trim(),
      loadDialog.querySelector(`input#player-one-game-piece`).value.trim() === `` ? `X` : loadDialog.querySelector(`input#player-one-game-piece`).value.trim(),
      loadDialog.querySelector(`select#player-one-type`).value,
      loadDialog.querySelector(`select#player-one-difficulty`).value,
      1
    );
    const playerTwo = createPlayer(
      loadDialog.querySelector(`input#player-two-name`).value.trim() === `` ? 'amgine' : loadDialog.querySelector(`input#player-two-name`).value.trim(),
      loadDialog.querySelector(`input#player-two-game-piece`).value.trim() === `` ? `O` : loadDialog.querySelector(`input#player-two-game-piece`).value.trim(),
      loadDialog.querySelector(`select#player-two-type`).value,
      loadDialog.querySelector(`select#player-two-difficulty`).value,
      2
    );
    if(playerOne.gamePiece === playerTwo.gamePiece) {
      alert(`Cannot have same game piece!`)
      loadDialog.showModal();
    } else if(playerOne.name === playerTwo.name) {
      alert(`Cannot have same name!`)
      loadDialog.showModal();
    } 
    else {
      displayController.clearBoardDisplay();
      gameBoard.initBoard();
      gamePlayers.length = 0;
      gamePlayers.push(playerOne, playerTwo);
      gameController.updateActiveGamePlayers(gamePlayers);
      gameController.randomizeFirstTurn();
      displayController.updateTurnDisplay(gameController.getCurrentPlayer().name);
      playerSessionController.initInfoDisplay(gamePlayers);
      if(gameController.getCurrentPlayer().type === `computer`) computerAI.makeAIMove(gameController.getCurrentPlayer());
      loadDialog.close();
    }
  });

  // Prevents user from escaping out of menu
  loadDialog.addEventListener((`cancel`), (e) => {
    e.preventDefault();
  });

  // Enables/Disables difficulty select menu if human or computer
  const typeDifficultySelect = document.querySelectorAll(`.type-difficulty-container`);
  typeDifficultySelect.forEach((container) => {
    container.addEventListener((`change`), (e) => {
      const typeSelected = container.querySelector(`select.player-type-select`).value;
      typeSelected === `human` ? container.querySelector(`select.difficulty-select`).setAttribute(`disabled`, `true`) : container.querySelector(`select.difficulty-select`).removeAttribute(`disabled`);
    });
  });
  return { openOptionsMenu };
})();


// displayController Module
// Handles The Game's User Interface
// Methods: updateTurnDisplay(), updateBoardDisplay(), clearBoardDisplay()  
const  displayController = (() => {
  gameBoard.initBoard();
  const currentBoard = gameBoard.getBoard();

  // Dynamically creates gameBoard display with relevant data attributes
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

  // Handles User Input on gameBoard() 
  const boardCells = document.querySelectorAll(`[data-row]`);
  boardCells.forEach((cell) => {
    cell.addEventListener((`click`), (e) => {
      const movePosition = [cell.getAttribute(`data-row`), cell.getAttribute(`data-column`)];
      if(gameController.checkMove(movePosition)) {
        updateBoardDisplay(movePosition);
      }
    });
  });

  // Input User gamePiece in cell
  const updateBoardDisplay = (movePosition) => {
    const cell = gameBoardDisplay.querySelector(`[data-row="${movePosition[0]}"][data-column="${movePosition[1]}"]`);
    cell.textContent = currentBoard[movePosition[0]][movePosition[1]];
    }

  // Player Options Menu Button
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

// endRoundDialog Module
// Handles the end of round winner display and options (Play Again, Open Player Options Menu)
// Methods: openEndRoundDialog()
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

// playerSessionController Module
// Handles the Player Session Information Statistics Container and Information
// Methods: initInfoDisplay(), updateSessionInfo(), incrementMoves(), incrementWins(), incrementLosses(), incrementTies() 
const playerSessionController = (() => {

  // DOM Element querySelectors
  //#region
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
  //#endregion
  
  let ties = 0;

  // Initializes Player Session Information
  const initInfoDisplay = (gamePlayers) => {
    const p1 = gamePlayers[0];
    const p2 = gamePlayers[1];

    p1SessionName.textContent = p1.name;
    p1SessionType.textContent = p1.type;
    if(p1.type === `computer`) p1SessionDifficulty.textContent = `(${p1.difficulty})`;
    p1SessionPiece.textContent = ` - [${p1.gamePiece}]`;

    p2SessionName.textContent = p2.name;
    p2SessionType.textContent = p2.type;
    if(p2.type === `computer`) p2SessionDifficulty.textContent = `(${p2.difficulty})`;
    p2SessionPiece.textContent = ` - [${p2.gamePiece}]`;
    ties = 0;
    updateSessionInfo(gamePlayers);
  }

  // Updates Player Session Information
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

// gameController Module 
// Handles the primary game logic and flow
// Methods: updateActiveGamePlayers(), getOtherPlayer(), randomizeFirstTurn(), getActiveGamePlayers(),
//          getCurrentPlayer(), getInactivePlayer(), updateCurrentPlayer(), checkBoard(), checkMove(),
//          checkResult(), startNewGame()
const gameController = (() => {
  const currentBoard = gameBoard.getBoard();
  const activeGamePlayers = [];
  let currentPlayer = null;
  let inactivePlayer = null;
  // Resets activeGamePlayers array and inputs new information values
  const updateActiveGamePlayers = (gamePlayers) => {
    currentPlayer = Math.floor(Math.random()*gamePlayers.length) === 0 ? gamePlayers[0] : gamePlayers[1];
    currentPlayer = gamePlayers[0];
    activeGamePlayers.length = 0;
    activeGamePlayers.push(gamePlayers[0], gamePlayers[1]);
  }

  // Swaps active and inactive player for their respective turn
  const updateCurrentPlayer = () => {
    currentPlayer === activeGamePlayers[0] ? (currentPlayer = activeGamePlayers[1], inactivePlayer = activeGamePlayers[0]) : (currentPlayer = activeGamePlayers[0], inactivePlayer = activeGamePlayers[1]);
    displayController.updateTurnDisplay(currentPlayer.name);
    if(currentPlayer.type === `computer`) computerAI.makeAIMove(currentPlayer);
  }
  const getActiveGamePlayers = () => activeGamePlayers;
  const getCurrentPlayer = () => currentPlayer;
  const getInactivePlayer = () => inactivePlayer;
  const randomizeFirstTurn = () => {
    currentPlayer = Math.floor(Math.random()*activeGamePlayers.length) === 0 ? activeGamePlayers[0] : activeGamePlayers[1];
  }

  // Returns the player that's not passed as an argument (Used in AI)
  const getOtherPlayer = (initialPlayer) => {
    const otherPlayer = (initialPlayer === activeGamePlayers[0] ? activeGamePlayers[1] : activeGamePlayers[0]);
    return otherPlayer; 
  }


  // Validates if an attempted move is valid and updates accordingly 
  const checkMove = (movePosition) => {
    if(!gameBoard.makeMove(movePosition, currentPlayer.gamePiece)) {
      alert(`${gameController.getCurrentPlayer().name}, please select an open spot.`)
      return false;
    } else { 
      displayController.updateBoardDisplay(movePosition);
      playerSessionController.incrementMoves(getCurrentPlayer());
      playerSessionController.updateSessionInfo(getActiveGamePlayers());
      !checkBoard(currentBoard) ? updateCurrentPlayer() : checkResult();
      displayController.updateTurnDisplay(currentPlayer.name);
      return true;
    }
  }

// Checks for 3 in a row or tie. Returns a result object containing status and gamePiece.
  const checkBoard = (board) => {
    const checkTie = (board) => {
      return (!board[0].includes(null) && !board[1].includes(null) && !board[2].includes(null)); 
    }
    const checkRow = (board, row) => {
      if(board[row].includes(null)) return null;
      if((board[row][0] === board[row][1] && board[row][0] === board[row][2])) return { status: `win`, gamePiece: board[row][0] };
      return null;
    }
    const checkColumn = (board, column) => {
      if(board[0][column] === null || board[1][column] === null || board[2][column] === null) return null;
      if((board[0][column] === board[1][column] && board[0][column] === board[2][column])) return { status: `win`, gamePiece: board[0][column] };
      return null;
    }
    const checkDiagonal = (board) => {
      if(board[1][1] === null) return null;
      if((board[0][0] === board[1][1] && board[0][0] === board[2][2]) || (board[0][2] === board[1][1] && board[0][2] === board[2][0])) return { status: `win`, gamePiece: board[1][1] };
      return null
    }
    let result = checkDiagonal(board);
    if(result) return result;
    for(let i = 0; i < board.length; i++) {
      result = checkRow(board,i);
      if(result) return result;
      result = checkColumn(board,i);
      if(result) return result;
    }
    if(checkTie(board)) return { status: `tie` };
    return null;
  }

  // Checks the result of the match and updates accordingly.
  const checkResult = () => {
    let result = gameController.checkBoard(currentBoard);
    if(result) {
      if(result.status === `tie`) { 
        playerSessionController.incrementTies();
        return endRoundDialog.openEndRoundDialog(`Tie`);
      }
      else{
        playerSessionController.incrementWins(currentPlayer)
        playerSessionController.incrementLosses(inactivePlayer); 
        playerSessionController.updateSessionInfo(gameController.getActiveGamePlayers());
        return endRoundDialog.openEndRoundDialog(currentPlayer.name);
      }
    }
  }

  const startNewGame = () => {
    displayController.clearBoardDisplay();
    gameBoard.initBoard();
    randomizeFirstTurn();
    if(currentPlayer.type === `computer`) computerAI.makeAIMove(currentPlayer);
  }
  return { 
    updateActiveGamePlayers,
    getOtherPlayer,
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


// computerAI Module - The bane of my existence
const computerAI = (() => {
  const makeAIMove = (player) => {
    const currentBoard = gameBoard.getBoard();
    const availableMoves = getAvailableMoves(gameBoard.getBoard());
    switch(player.difficulty) {
      case `easy`:
        if(availableMoves.length > 0) randomMove();
        break;
      case `stupid`:
        const bestMove = getBestMove(currentBoard, player);
        gameController.checkMove(bestMove)
        break;
      case `medium`:
        break;
      case `hard`:
        break;
      case `impossible`:
        break;
    }
  }
  // Returns all available moves on the passed board
  const getAvailableMoves = (board) => {
    const availableMoves = [];
    for(let i = 0; i < board.length; i++){
      for(let j = 0; j < board[i].length; j++){
        if(board[i][j] === null) availableMoves.push([i,j]); 
      }
    }
    return availableMoves;
  }

  // Generates a random move from available moves
  const randomMove = () => {
    const availableMoves = getAvailableMoves(gameBoard.getBoard());
    const randomMovePos = availableMoves[Math.floor(Math.random()*availableMoves.length)];
    gameController.checkMove(randomMovePos);
  }

  // miniMax Helper function
  const getBestMove = (board, player) => {
    let evalObj = miniMax(board, 0, true, player, []);
    if(evalObj.score === 0 && board[1][1] === null) evalObj.move = [1,1];
    console.log(evalObj)
  return evalObj.move;
}


  // Evaluate board's state and returns relevant score
  // 100 if maximizing player wins -100 if opponent wins (subtract depth for prioritizing quicker wins)
  const evaluateBoard = (board, depth, player) => {
    const result = gameController.checkBoard(board);
    if(!result || result.status === `tie`) return 0
    if(result) {
      if(result.gamePiece === player.gamePiece) return 100 - depth;
      else return depth - 100;
    }
    return 0;
  } 


  // Calculates the minimizing and maximizing scores of every possible game state to make the most optimal move.
  // It takes an initial game board's state and recursively creates a tree of nodes which
  // represent all possible move combinations (alternating between maximizing and minimizing player)
  // with that particular game state's evaluation score.
  // This implementation returns an object containing the optimal evaluation score and move.
  // At least it was supposed to.... 
  const miniMax = (board, depth, isMaximizing, player, currentMove) => {
    const opponent = gameController.getOtherPlayer(player);
    const moves = getAvailableMoves(board);
    const score = evaluateBoard(board, depth, player);
    if(score <= -98) return {score:score, move:currentMove};
    if(Math.abs(score) === 100) return {score:score, move:currentMove};
    if(moves.length === 0) return {score:0, move:currentMove};
    if(isMaximizing) {
      let bestMove = null;
      let maxEval = -Infinity;
      for(let move of moves) {
        gameBoard.simulateMove(board,move,player);
        let evalObj = miniMax(board, depth + 1, false, opponent, move);
        if(evalObj.score > maxEval) {
          maxEval = evalObj.score;
          bestMove = move;
        }
        gameBoard.undoMove(board, move);
      }
      return {score:maxEval, move:bestMove};
    } else {
      let bestMove = null;
      let minEval = Infinity;
        for(let move of moves) {
          gameBoard.simulateMove(board,move,player);
          let evalObj = miniMax(board, depth + 1, true, opponent, move);
          if(evalObj.score < minEval) {
            minEval = evalObj.score;
            bestMove = move
          }
          gameBoard.undoMove(board,move);
        }
      return {score:minEval, move:bestMove};
    }
  }
  return { makeAIMove };
})();