import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../_styles/LevelSelector.module.scss';
import { WinLevel } from './Board';

export interface Star {
  score?: number;
  moves?: number;
  time?: number;
  average?: number;
}

export interface Level {
  level: number;
  stars: number;
  figures?: string[];
  size: number;
  goal?: {
    level: number;
    time?: number;
    score?: number;
    stars: {
      1: Star;
      2: Star;
      3: Star;
    };
  };
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

  const [localLevels, setLocalLevels] = useState<WinLevel[] | null>(null);

  const levelStatus = (number: number) => {
    const level = localLevels
      ? localLevels.find((lev) => lev.level === number)
      : null;
    return level;
  };

  useEffect(() => {
    const getLocal = async () => {
      const local = await JSON.parse(localStorage.getItem('levels') as string);
      setLocalLevels(local);
    };
    getLocal();
  }, []);

  const getState = (number: number) => {
    if (!!levelStatus(number)) {
      return 'played';
    }
    if (!levelStatus(number)) {
      return 'locked';
    }
  };

  const conditionStar = (n: number, number: number) => {
    const lev = levelStatus(number);
    return lev && n <= lev.stars;
  };

  const classState = (number: number) => {
    if (getState(number) === 'played') {
      return 'played';
    }
    if (getState(number - 1) === 'played') {
      return 'unlocked';
    }
    return 'locked';
  };

  return (
    <div className={styles.modal}>
      <h2>Select a Level</h2>
      <div className={styles.levelGrid}>
        {levels.map((level) => (
          <div
            key={level.level}
            className={`${styles.levelItem} ${styles[classState(level.level)]}`}
            onClick={() =>
              classState(level.level) !== 'locked' &&
              handleLevelClick(level.level)
            }
          >
            {getState(level.level) === 'played' && (
              <>
                <span className={styles.levelNumber}>{level.level}</span>
                <div className={styles.stars}>
                  {[1, 2, 3].map((n) => {
                    if (conditionStar(n, level.level)) {
                      return (
                        <Image
                          key={`Level ${level.level} Star ${n}`}
                          src='/icons/star-fill.png'
                          alt='Star Full'
                          width={16}
                          height={16}
                        />
                      );
                    } else {
                      return (
                        <Image
                          key={`Level ${level.level} Star ${n}`}
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
            {getState(level.level) !== 'played' &&
              getState(level.level - 1) === 'played' && (
                <span className={styles.levelNumber}>{level.level}</span>
              )}
            {getState(level.level - 1) !== 'played' &&
              getState(level.level) === 'locked' && (
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
