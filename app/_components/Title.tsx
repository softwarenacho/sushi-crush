import Image from 'next/image';

const Title = ({ title = '' }: { title?: string }) => {
  return (
    <>
      <Image src='/sushi/onigiri.webp' alt='Onigiri' width={64} height={64} />
      <h1>{title}</h1>
    </>
  );
};

export default Title;
