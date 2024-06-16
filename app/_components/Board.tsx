import { useEffect, useState } from 'react';
import styles from '../_styles/Board.module.scss';

const figures = ['onigiri', 'maki', 'nigiri', 'noodle', 'rice', 'temaki'];
const boardSize = 10;

const getRandomFigure = (): string =>
  figures[Math.floor(Math.random() * figures.length)];

type Cell = string | null;
type Board = Cell[][];
type Match = {
  row: number;
  col: number;
  length: number;
  horizontal: boolean;
};
type SwapInfo = {
  row1: number;
  col1: number;
  row2: number;
  col2: number;
} | null;
type MatchIndicator = Match & { score: number };

const generateBoard = (): Board => {
  let board: Board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null).map(getRandomFigure));

  while (hasMatches(board)) {
    board = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null).map(getRandomFigure));
  }
  return board;
};

const hasMatches = (board: Board): boolean => {
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

const Board = () => {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchIndicators, setMatchIndicators] = useState<MatchIndicator[]>([]);
  const [swapInfo, setSwapInfo] = useState<SwapInfo>(null);

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  const findMatches = (board: Board): Match[] => {
    const foundMatches: Match[] = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        let matchLength = 1;
        while (
          col + matchLength < boardSize &&
          board[row][col] === board[row][col + matchLength]
        ) {
          matchLength++;
        }
        if (matchLength >= 3) {
          foundMatches.push({
            row,
            col,
            length: matchLength,
            horizontal: true,
          });
        }
        matchLength = 1;
        while (
          row + matchLength < boardSize &&
          board[row][col] === board[row + matchLength][col]
        ) {
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
    return foundMatches;
  };

  const processMatches = (matches: Match[], newBoard: Board): number => {
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

  const handleMatches = (newBoard: Board, initialScore: number) => {
    let totalScore = initialScore;
    let foundMatches = findMatches(newBoard);

    if (foundMatches.length > 0) {
      setMatches(foundMatches);
      setMatchIndicators(
        foundMatches.map((match) => ({ ...match, score: match.length })),
      );
      setAnimating(true);

      setTimeout(() => {
        totalScore += processMatches(foundMatches, newBoard);
        fillBoard(newBoard);

        setMatches([]);
        setMatchIndicators([]);
        setBoard([...newBoard]); // Ensure re-render with new board state
        setTimeout(() => {
          setAnimating(false);
          setScore(totalScore);
          handleMatches(newBoard, totalScore);
        }, 500); // Delay to show the updated board state before the next match
      }, 500);
    } else {
      setBoard(newBoard);
    }
  };

  const fillBoard = (newBoard: Board) => {
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

  const swap = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ): Board => {
    const newBoard = board.map((row) => row.slice());
    [newBoard[row1][col1], newBoard[row2][col2]] = [
      newBoard[row2][col2],
      newBoard[row1][col1],
    ];
    return newBoard;
  };

  const isSwapValid = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ): boolean => {
    const tempBoard = swap(row1, col1, row2, col2);
    const foundMatches = findMatches(tempBoard);
    return foundMatches.length > 0;
  };

  const handleClick = (row: number, col: number) => {
    if (animating) return;
    if (selected) {
      const [selectedRow, selectedCol] = selected;
      if (
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row)
      ) {
        if (isSwapValid(selectedRow, selectedCol, row, col)) {
          setSwapInfo({
            row1: selectedRow,
            col1: selectedCol,
            row2: row,
            col2: col,
          });
          setAnimating(true);
          setTimeout(() => {
            const newBoard = swap(selectedRow, selectedCol, row, col);
            handleMatches(newBoard, score);
            setSelected(null);
            setSwapInfo(null);
          }, 500);
        } else {
          setSelected([row, col]);
        }
      } else {
        setSelected([row, col]);
      }
    } else {
      setSelected([row, col]);
    }
  };

  return (
    <div className={styles.game}>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${
                  selected &&
                  selected[0] === rowIndex &&
                  selected[1] === colIndex
                    ? styles.selected
                    : ''
                } 
                  ${
                    swapInfo &&
                    ((swapInfo.row1 === rowIndex &&
                      swapInfo.col1 === colIndex) ||
                      (swapInfo.row2 === rowIndex &&
                        swapInfo.col2 === colIndex))
                      ? styles.swap
                      : ''
                  } 
                  ${
                    matches.some(
                      (match) =>
                        match.row === rowIndex &&
                        match.col <= colIndex &&
                        colIndex < match.col + match.length &&
                        match.horizontal,
                    ) ||
                    matches.some(
                      (match) =>
                        match.col === colIndex &&
                        match.row <= rowIndex &&
                        rowIndex < match.row + match.length &&
                        !match.horizontal,
                    )
                      ? styles.match
                      : ''
                  }`}
                onClick={() => handleClick(rowIndex, colIndex)}
                style={{
                  transform: swapInfo
                    ? swapInfo.row1 === rowIndex && swapInfo.col1 === colIndex
                      ? `translate(${(swapInfo.col2 - swapInfo.col1) * 40}px, ${
                          (swapInfo.row2 - swapInfo.row1) * 40
                        }px)`
                      : swapInfo.row2 === rowIndex && swapInfo.col2 === colIndex
                      ? `translate(${(swapInfo.col1 - swapInfo.col2) * 40}px, ${
                          (swapInfo.row1 - swapInfo.row2) * 40
                        }px)`
                      : 'none'
                    : 'none',
                  transition: swapInfo ? 'transform 1s' : 'none',
                  backgroundImage: `url('/sushi/${cell}.webp')`,
                }}
              ></div>
            ))}
          </div>
        ))}
        {matchIndicators.map((indicator, index) => (
          <div
            key={index}
            className={styles.matchIndicator}
            style={{
              top: `${indicator.row * 40}px`,
              left: `${
                indicator.horizontal
                  ? (indicator.col + indicator.length / 2) * 40 - 20
                  : indicator.col * 40
              }px`,
              transform: `${
                indicator.horizontal ? 'translateX(-50%)' : 'translateY(-50%)'
              }`,
            }}
          >
            +{indicator.score}
          </div>
        ))}
      </div>
      {score > 0 && (
        <button
          className={styles.generate}
          onClick={() => {
            setBoard(generateBoard());
            setScore(0);
          }}
        >
          Generate
        </button>
      )}
    </div>
  );
};

export default Board;
