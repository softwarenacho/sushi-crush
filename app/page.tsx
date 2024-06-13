import Board from '@/_components/Board';
import Image from 'next/image';
import { Suspense } from 'react';
import styles from './page.module.scss';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Image src='/sushi/onigiri.webp' alt='Onigiri' width={64} height={64} />
        <h1 className='pacifico'>Sushi Crush</h1>
        <section>
          <Image src='/sushi/maki.webp' alt='Maki' width={48} height={48} />
          <Image src='/sushi/nigiri.webp' alt='Nigiri' width={48} height={48} />
          <Image src='/sushi/noodle.webp' alt='Noodle' width={48} height={48} />
          <Image src='/sushi/rice.webp' alt='Rice' width={48} height={48} />
          <Image src='/sushi/temaki.webp' alt='Temake' width={48} height={48} />
        </section>
        <p>
          Dive into the delicious world of Sushi Crush, a delightful puzzle game
          where you match and crush sushi pieces to progress through exciting
          levels. Combine your favorite sushi types and create mouth-watering
          combos in this charming and visually stunning game. Perfect for sushi
          lovers and puzzle enthusiasts alike!
        </p>
        <section>
          <Board
            boardSize={10}
            sushiOptions={[
              'onigiri',
              'maki',
              'nigiri',
              'noodle',
              'rice',
              'temaki',
            ]}
          />
        </section>
      </main>
    </Suspense>
  );
}
