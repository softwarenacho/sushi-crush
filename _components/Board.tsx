'use client';
import { useCallback, useEffect, useState } from 'react';

type SushiOption = 'onigiri' | 'maki' | 'nigiri' | 'noodle' | 'rice' | 'temaki';

interface BoardProps {
  boardSize: number;
  sushiOptions: SushiOption[];
}

const Board: React.FC<BoardProps> = ({ boardSize, sushiOptions }) => {
  const [board, setBoard] = useState<SushiOption[][]>([[]]);

  const getRandomSushi = useCallback(
    (row: number, col: number, board: SushiOption[][]) => {
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
        sushi =
          filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
      }

      return sushi;
    },
    [sushiOptions],
  );

  const generateBoard = useCallback(() => {
    const board: SushiOption[][] = [];

    for (let i = 0; i < boardSize; i++) {
      const row: SushiOption[] = [];
      for (let j = 0; j < boardSize; j++) {
        const sushi = getRandomSushi(i, j, board);
        row.push(sushi);
      }
      board.push(row);
    }

    setBoard(board);
  }, [boardSize, getRandomSushi]);

  useEffect(() => {
    if (!board[0][0]) generateBoard();
  }, [board, generateBoard]);

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
                border: '1px solid black',
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
        onClick={() => generateBoard()}
      >
        Generate
      </button>
    </div>
  );
};

export default Board;
