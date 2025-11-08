// 'app/page.tsx'는 홈페이지(/)의 알맹이입니다.
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}