import Image from 'next/image';
import styles from '../_styles//Instructions.module.scss';

const Instructions = ({
  closeModal,
  openGame,
}: {
  closeModal: () => void;
  openGame: () => void;
}) => {
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
          <li>
            <strong>Objective:</strong> The goal of the game is to match three
            or more identical sushi pieces in a row or column to score points.
          </li>
          <li>
            <strong>Gameplay:</strong>
            <ol>
              <li>1. Click on a sushi piece to select it.</li>
              <li>2. Click on an adjacent piece to swap them.</li>
              <li>
                3. If the swap creates a match of three or more identical
                pieces, those pieces will disappear, and new pieces will fall
                into place.
              </li>
              <li>4. Continue making matches to accumulate points.</li>
            </ol>
          </li>
          <li>
            <strong>Scoring:</strong> Points are awarded based on the number of
            matches and the length of each match.
          </li>
          <li>
            <strong>Moves:</strong> The game tracks the number of moves made.
          </li>
          <li>
            <strong>Reset:</strong> Click the Reset Board button to start a new
            game, this will generate a new board and reset the score.
          </li>
        </ul>
        <button onClick={() => openGame()} className={styles.button}>
          Start Now
        </button>
      </div>
    </div>
  );
};

export default Instructions;
