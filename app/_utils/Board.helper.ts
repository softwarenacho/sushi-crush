import { BoardInterface, Match } from '../_interfaces/Board.interface';

const boardSize = 10;
const figures = ['onigiri', 'maki', 'nigiri', 'noodle', 'rice', 'temaki'];

const getRandomFigure = (): string =>
  figures[Math.floor(Math.random() * figures.length)];

export const generateBoard = (): BoardInterface => {
  let board: BoardInterface = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null).map(getRandomFigure));

  while (hasMatches(board)) {
    board = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null).map(getRandomFigure));
  }
  return board;
};

const hasMatches = (board: BoardInterface): boolean => {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (
        (col < boardSize - 2 &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2]) ||
        (row < boardSize - 2 &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col])
      ) {
        return true;
      }
    }
  }
  return false;
};

export const findMatches = (board: BoardInterface): Match[] => {
  const boardSize = board.length;
  const foundMatches: Match[] = [];
  const visitedHorizontal: boolean[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
  const visitedVertical: boolean[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (!visitedHorizontal[row][col]) {
        let matchLength = 1;
        while (
          col + matchLength < boardSize &&
          board[row][col] === board[row][col + matchLength]
        ) {
          matchLength++;
        }
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            visitedHorizontal[row][col + i] = true;
          }
          foundMatches.push({
            row,
            col,
            length: matchLength,
            horizontal: true,
          });
        }
      }

      if (!visitedVertical[row][col]) {
        let matchLength = 1;
        while (
          row + matchLength < boardSize &&
          board[row][col] === board[row + matchLength][col]
        ) {
          matchLength++;
        }
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            visitedVertical[row + i][col] = true;
          }
          foundMatches.push({
            row,
            col,
            length: matchLength,
            horizontal: false,
          });
        }
      }
    }
  }
  return foundMatches;
};

export const processMatches = (matches: Match[], newBoard: BoardInterface): number => {
  let newScore = 0;
  matches.forEach((match) => {
    newScore += match.length;
    for (let i = 0; i < match.length; i++) {
      if (match.horizontal) {
        newBoard[match.row][match.col + i] = null;
      } else {
        newBoard[match.row + i][match.col] = null;
      }
    }
  });
  return newScore;
};

export const fillBoard = (newBoard: BoardInterface) => {
  for (let col = 0; col < boardSize; col++) {
    for (let row = boardSize - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        for (let fillRow = row; fillRow >= 0; fillRow--) {
          if (newBoard[fillRow][col] !== null) {
            newBoard[row][col] = newBoard[fillRow][col];
            newBoard[fillRow][col] = null;
            break;
          }
        }
      }
      if (newBoard[row][col] === null) {
        newBoard[row][col] = getRandomFigure();
      }
    }
  }
};
