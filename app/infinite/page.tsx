'use client';

import { useRouter } from 'next/navigation';
import Board from '../_components/Board';
import Title from '../_components/Title';
import styles from '../_styles/Infinite.module.scss';

const Infinite = () => {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <Title title='Sushi Crush - Infinite Mode' />
      <Board close={() => router.push('/')} />
    </main>
  );
};

export default Infinite;
