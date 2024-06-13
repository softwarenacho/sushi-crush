'use client';
import { useCallback, useEffect, useState } from 'react';

type SushiOption = 'onigiri' | 'maki' | 'nigiri' | 'noodle' | 'rice' | 'temaki';
type Position = { row: number; col: number }[];

interface BoardProps {
  boardSize: number;
  sushiOptions: SushiOption[];
}

const detectMatches = (board: SushiOption[][]): Position[] => {
  const matches: Position[] = [];
  const numRows = board.length;
  const numCols = board[0].length;

  // Helper function to find matches in a given direction (horizontal or vertical)
  const findMatchesInDirection = (
    startRow: number,
    startCol: number,
    dRow: number,
    dCol: number,
  ): Position => {
    const matchPositions: Position = [];
    const sushi = board[startRow][startCol];
    let row = startRow;
    let col = startCol;

    // Collect consecutive sushis in the specified direction
    while (
      row >= 0 &&
      row < numRows &&
      col >= 0 &&
      col < numCols &&
      board[row][col] === sushi
    ) {
      matchPositions.push({ row, col });
      row += dRow;
      col += dCol;
    }

    // If the match length is 3, 4, or 5, return the positions; otherwise, return an empty array
    if (matchPositions.length >= 3 && matchPositions.length <= 5) {
      return matchPositions;
    } else {
      return [];
    }
  };

  // Check for horizontal matches
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (col <= numCols - 3) {
        const horizontalMatches3 = findMatchesInDirection(row, col, 0, 1);
        if (horizontalMatches3.length > 0) {
          matches.push(horizontalMatches3);
          col += horizontalMatches3.length - 1; // Skip over this match in the next iteration
        }
      }
      if (col <= numCols - 4) {
        const horizontalMatches4 = findMatchesInDirection(row, col, 0, 1);
        if (horizontalMatches4.length > 0) {
          matches.push(horizontalMatches4);
          col += horizontalMatches4.length - 1; // Skip over this match in the next iteration
        }
      }
      if (col <= numCols - 5) {
        const horizontalMatches5 = findMatchesInDirection(row, col, 0, 1);
        if (horizontalMatches5.length > 0) {
          matches.push(horizontalMatches5);
          col += horizontalMatches5.length - 1; // Skip over this match in the next iteration
        }
      }
    }
  }

  // Check for vertical matches
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      if (row <= numRows - 3) {
        const verticalMatches3 = findMatchesInDirection(row, col, 1, 0);
        if (verticalMatches3.length > 0) {
          matches.push(verticalMatches3);
          row += verticalMatches3.length - 1; // Skip over this match in the next iteration
        }
      }
      if (row <= numRows - 4) {
        const verticalMatches4 = findMatchesInDirection(row, col, 1, 0);
        if (verticalMatches4.length > 0) {
          matches.push(verticalMatches4);
          row += verticalMatches4.length - 1; // Skip over this match in the next iteration
        }
      }
      if (row <= numRows - 5) {
        const verticalMatches5 = findMatchesInDirection(row, col, 1, 0);
        if (verticalMatches5.length > 0) {
          matches.push(verticalMatches5);
          row += verticalMatches5.length - 1; // Skip over this match in the next iteration
        }
      }
    }
  }

  return matches;
};

const getRandomSushi = (
  sushiOptions: SushiOption[],
  row: number,
  col: number,
  board: SushiOption[][],
) => {
  const options = [...sushiOptions];
  let sushi = options[Math.floor(Math.random() * options.length)];

  const hasConsecutiveSushi = (
    r: number,
    c: number,
    rOffset: number,
    cOffset: number,
    count: number,
  ) => {
    for (let i = 1; i < count; i++) {
      const newRow = r + rOffset * i;
      const newCol = c + cOffset * i;
      if (
        newRow < 0 ||
        newRow >= board.length ||
        newCol < 0 ||
        newCol >= board[newRow]?.length ||
        board[newRow]?.[newCol] !== sushi
      ) {
        return false;
      }
    }
    return true;
  };

  while (
    (col >= 2 && hasConsecutiveSushi(row, col, 0, -1, 2)) ||
    (col >= 1 &&
      col < (board[row]?.length ?? 0) - 1 &&
      hasConsecutiveSushi(row, col, 0, -1, 2)) ||
    (col >= 1 &&
      col < (board[row]?.length ?? 0) - 2 &&
      hasConsecutiveSushi(row, col, 0, -1, 3)) ||
    (row >= 2 && hasConsecutiveSushi(row, col, -1, 0, 2)) ||
    (row >= 1 &&
      row < board.length - 1 &&
      hasConsecutiveSushi(row, col, -1, 0, 2)) ||
    (row >= 1 &&
      row < board.length - 2 &&
      hasConsecutiveSushi(row, col, -1, 0, 3))
  ) {
    const filteredOptions = options.filter((option) => option !== sushi);
    sushi = filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
  }

  return sushi;
};

const generateBoard = (
  boardSize: number,
  sushiOptions: SushiOption[],
): SushiOption[][] => {
  const board: SushiOption[][] = [];
  for (let i = 0; i < boardSize; i++) {
    const row: SushiOption[] = [];
    for (let j = 0; j < boardSize; j++) {
      const sushi = getRandomSushi(sushiOptions, i, j, board);
      row.push(sushi);
    }
    board.push(row);
  }
  const matches = detectMatches(board);
  if (matches.length > 0) {
    return generateBoard(boardSize, sushiOptions);
  }
  return board;
};

const Board: React.FC<BoardProps> = ({ boardSize, sushiOptions }) => {
  const [board, setBoard] = useState<SushiOption[][]>([[]]);

  const changeBoard = useCallback(() => {
    const newBoard = generateBoard(boardSize, sushiOptions);
    setBoard(newBoard);
  }, [boardSize, sushiOptions]);

  useEffect(() => {
    if (!board[0][0]) {
      changeBoard();
    }
  }, [board, changeBoard]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 3rem)`,
          gridTemplateRows: `repeat(${boardSize}, 3rem)`,
          background: 'white',
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((sushi, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #1e1e1e',
                textAlign: 'center',
                backgroundImage: `url('/sushi/${sushi}.webp')`,
                backgroundSize: '90%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            ></div>
          )),
        )}
      </div>
      <button
        style={{
          marginTop: '2rem',
          height: '4rem',
          fontFamily: '"Pacifico", cursive',
          fontSize: '2rem',
        }}
        onClick={() => changeBoard()}
      >
        Generate
      </button>
    </div>
  );
};

export default Board;
