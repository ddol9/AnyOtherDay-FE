"use client";

import Image from "next/image";
import { useEffect } from "react";

interface Step6Props {
  onNext?: () => void;
}

export default function Step6({ onNext }: Step6Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white px-4 max-w-md mx-auto">
      <Image
        src="/icons/landing/landing-text17.svg"
        alt="업로드 완료"
        width={240}
        height={240}
        className="object-contain"
      />
    </div>
  );
}
