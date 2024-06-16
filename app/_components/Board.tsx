'use client';
import { useCallback, useEffect, useState } from 'react';
import { BoardProps, SushiOption } from '../_interfaces/Board.interface';
import { generateBoard } from '../_utils/boardHelper';

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
