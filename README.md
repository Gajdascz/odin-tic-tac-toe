# odin-tic-tac-toe
TOP: Tic-Tac-Toe <br/>
Live Preview: https://gajdascz.github.io/odin-tic-tac-toe/ <br/>
Project Page: [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe)

# Features
## Gameplay
* Create your players with a unique name and game piece.
* Randomized first turns after each round and upon initial game creation.
* Human vs Human: You and your local friend can create your own player, pick your own game piece, and play head to head.
* Human vs Computer and Computer vs Computer: Play against the computer, or put two computers against each other with any of the following difficulties
  -  Easy: Computer selects an available move completely randomly.
  -  Medium: Computer has a 50% chance of playing an optimal or random move.
  -  Hard: Computer has an 80% chance of playing an optimal move and a 20% chance of playing a random move.
  -  Impossible: Computer will always play the optimal move (unbeatable).
  -  **Optimal moves are decided using a miniMax algorithm implementaiton.**
* Live player session information display containing the following
  - Player:
    - name
    - type + game piece
    - Losses
    - Wins
    - Moves
 - Totals:
   - Ties
   - Games
   - Moves

## Other
* If you're interested in playing around with the code there are some useful debugging and analyzing functions you can use to test and watch the miniMax algorithm do its thing.
  - analyzeMiniMax(): Lots of readable console logs and tables to watch the algorithm play out step by step (Make sure you use breakpoints!).
  - testMiniMax(): Displays some basic results includingthe miniMax resulting score, optimal move recommendation and the board the move is being recommended on. 
