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
  const foundMatches: Match[] = [];
  const visited: boolean[][] = Array(boardSize)
    .fill(false)
    .map(() => Array(boardSize).fill(false));
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (!visited[row][col]) {
        let matchLength = 1;
        let horizontal = false;
        while (
          col + matchLength < boardSize &&
          board[row][col] === board[row][col + matchLength]
        ) {
          visited[row][col + matchLength] = true;
          matchLength++;
          horizontal = true;
        }
        if (matchLength >= 3 && horizontal) {
          foundMatches.push({
            row,
            col,
            length: matchLength,
            horizontal: true,
          });
        }
        matchLength = 1;
        horizontal = false;
        while (
          row + matchLength < boardSize &&
          board[row][col] === board[row + matchLength][col]
        ) {
          visited[row + matchLength][col] = true;
          matchLength++;
        }
        if (matchLength >= 3) {
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
  console.log('🚀 ~ findMatches ~ foundMatches:', foundMatches);
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
