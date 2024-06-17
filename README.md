# Sushi Crush Game

## Getting Started

Dive into the delicious world of Sushi Crush, a delightful match-3 puzzle game built using React and Next.js. Players swap adjacent sushi pieces on a board to create rows or columns of three or more identical pieces. Matched sushi pieces disappear, new ones fall into place, and players score points for each figure in a match. The game continues infinitely to achieve the highest score possible and the best average.

## Description

Sushi-Crush is an exciting match-3 puzzle game where players swap adjacent sushi pieces to create matches. The game is built using React and Next.js and provides a fun and interactive way to pass the time.

## Basic Instructions

1. **Objective**: The goal of the game is to match three or more identical sushi pieces in a row or column to score points.
2. **Gameplay**:
   - Click on a sushi piece to select it.
   - Click on an adjacent piece to swap them.
   - If the swap creates a match of three or more identical pieces, those pieces will disappear, and new pieces will fall into place.
   - Continue making matches to accumulate points.
3. **Scoring**: Points are awarded based on the number of matches and the length of each match.
4. **Moves**: The game tracks the number of moves made.
5. **Reset**: Click the "Reset Board" button to start a new game.

## Setup and Development

To set up Sushi-Crush locally, follow these steps:

1. Clone the repository:

```sh
git clone https://github.com/softwarenacho/sushi-crush.git
```

2. Navigate to the project directory:

```sh
cd sushi-crush
```

3. Install dependencies:

```sh
   yarn install
```

4. Start the development server:

```sh
  yarn dev
```

5. You can build the production run:

```sh
  yarn build
  yarn start
```

The game should now be running at http://localhost:3000.

## Helpers

- fillBoard(board): Fills the board with new sushi pieces.
- findMatches(board): Finds matches on the board.
- generateBoard(): Generates a new game board.
- processMatches(matches, board): Processes the matches, updates the board, and returns the score.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
Feel free to modify this documentation as needed to fit your project's specifics.
