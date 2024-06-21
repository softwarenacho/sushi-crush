import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import styles from '../_styles/LevelSelector.module.scss';

export interface Level {
  number: number;
  state: 'played' | 'unlocked' | 'locked';
  stars: number;
}

const LevelSelectorModal = ({
  levels,
  setLevel,
}: {
  levels: Level[];
  setLevel: Dispatch<SetStateAction<number>>;
}) => {
  const handleLevelClick = (levelNumber: number) => {
    setLevel(levelNumber);
  };

  return (
    <div className={styles.modal}>
      <h2>Select a Level</h2>
      <div className={styles.levelGrid}>
        {levels.map((level) => (
          <div
            key={level.number}
            className={`${styles.levelItem} ${styles[level.state]}`}
            onClick={() =>
              level.state !== 'locked' && handleLevelClick(level.number)
            }
          >
            {level.state === 'played' && (
              <>
                <span className={styles.levelNumber}>{level.number}</span>
                <div className={styles.stars}>
                  {[1, 2, 3].map((n) => {
                    if (n <= level.stars) {
                      return (
                        <Image
                          key={`Level ${level.number} Star ${n}`}
                          src='/icons/star-fill.png'
                          alt='Star Full'
                          width={16}
                          height={16}
                        />
                      );
                    } else {
                      return (
                        <Image
                          key={`Level ${level.number} Star ${n}`}
                          src='/icons/star-empty.png'
                          alt='Star Empty'
                          width={16}
                          height={16}
                        />
                      );
                    }
                  })}
                </div>
              </>
            )}
            {level.state === 'unlocked' && (
              <span className={styles.levelNumber}>{level.number}</span>
            )}
            {level.state === 'locked' && (
              <Image
                key={`Locked level`}
                src='/icons/lock.png'
                alt='Locked'
                width={24}
                height={24}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelSelectorModal;
