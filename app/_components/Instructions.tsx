import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../_styles//Instructions.module.scss';

const Instructions = ({
  closeModal,
  openGame,
}: {
  closeModal: () => void;
  openGame: () => void;
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    localStorage.setItem('hideInstructions', isChecked.toString());
  }, [isChecked]);

  useEffect(() => {
    const storedValue = localStorage.getItem('hideInstructions');
    setIsChecked(storedValue === 'true');
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={() => closeModal()}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>How to Play Sushi-Crush</h2>
        <section>
          <Image src='/sushi/maki.webp' alt='Maki' width={48} height={48} />
          <Image src='/sushi/nigiri.webp' alt='Nigiri' width={48} height={48} />
          <Image src='/sushi/noodle.webp' alt='Noodle' width={48} height={48} />
          <Image src='/sushi/rice.webp' alt='Rice' width={48} height={48} />
          <Image src='/sushi/temaki.webp' alt='Temake' width={48} height={48} />
        </section>
        <ul>
          <li className={styles.small}>
            <strong>Objective:</strong> The goal of the game is to match three
            or more identical sushi pieces in a row or column to score points.
            Multiple matches in a single movement will increase your average.
          </li>
          <li className={styles.small}>
            <strong>Gameplay:</strong>
            <ol>
              <li>
                1. Click on a sushi piece to select it. For touch devices, tap
                on a sushi piece.
              </li>
              <li>
                2. Click on an adjacent piece to swap them. On touch devices,
                swipe horizontally or vertically between adjacent pieces.
              </li>
              <li>
                3. If the swap creates a match of three or more identical
                pieces, those pieces will disappear, and new pieces will fall
                into place.
              </li>
              <li>4. Continue making matches to accumulate points.</li>
            </ol>
          </li>
          <li className={styles.small}>
            <strong>Moves:</strong> The game tracks the number of moves made.
          </li>
          <li className={styles.small}>
            <strong>Scoring:</strong> Points are awarded based on the length of
            each match.
          </li>
          <li className={styles.small}>
            <strong>Average:</strong> It{"'"}s the relation between score and
            moves.
          </li>
          <li className={styles.small}>
            <strong>Reset:</strong> Click the Reset button to start a new game,
            this will generate a new board and reset the score.
          </li>
        </ul>
        <label>
          <input onChange={handleCheckboxChange} type='checkbox' />
          Don{"'"}t show again
        </label>
        <button onClick={openGame} className={styles.button}>
          Start Now
        </button>
      </div>
    </div>
  );
};

export default Instructions;
