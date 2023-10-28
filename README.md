# Odin Tic-Tac-Toe
- **Live Preview**: https://gajdascz.github.io/odin-tic-tac-toe/
- **Project Page**: [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe)

# Features
## Gameplay
* Create your players with unique names and game pieces.
* Randomized first turns after each round and upon initial game creation.
* Human vs Human: Compete locally against freinds and family or against yourself.
* Human vs Computer and Computer vs Computer: Challenge the computer or watch two AI opponents battle it out at different difficulty levels.
  - **Easy**: The computer selects moves randomly.
  - **Medium**: The computer has a 50% chance of playing optimally.
  - **Hard**: The computer has an 80% chance of playing an optimal move and a 20% chance of playing a random move.
  - **Impossible**: The computer always plays the optimal move (unbeatable).
  - **Optimal moves are determined using a miniMax algorithm.**
* Live player session information display containing the following
  - Player:
    - _name_
    - _type_ + _game piece_
    - _Losses_
    - _Wins_
    - _Moves_
  - Totals:
    - _Ties_
    - _Games_
    - _Moves_

### Other
- If you're interested in exploring the code, there are debugging and analyzing functions available for testing and observing the miniMax algorithm in action:
  - `analyzeMiniMax()`: Offers detailed console logs and tables for step-by-step algorithm analysis. (Use breakpoints for better observation and to not overload your browser!)
  - `testMiniMax()`: Provides basic results, including the miniMax resulting score, optimal move recommendations, and the recommended move's board state.
