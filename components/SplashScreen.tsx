"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 2초 뒤에 페이드 아웃 시작
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // 2.5초 뒤에 컴포넌트 완전히 제거 (페이드 아웃 시간 포함)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${isFading ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="relative flex flex-col items-center animate-pulse">
        <Image
          src="/logo-180.png"
          alt="UniMate Logo"
          width={120}
          height={120}
          className="object-contain"
          priority
        />
        <h1 className="mt-4 text-2xl font-bold tracking-widest text-primary">
          UniMate
        </h1>
      </div>
    </div>
  );
}
