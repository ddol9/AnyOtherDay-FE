import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Step5Props {
  onUpload: () => void;
  onSkip: () => void;
}

export default function Step5({ onUpload, onSkip }: Step5Props) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between bg-white px-4 py-12 max-w-md mx-auto">
      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/icons/landing/landing-text15.svg"
          alt="음성 업로드 안내"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <div className="w-full space-y-2 pb-8">
        <Button
          onClick={onUpload}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-none text-base"
        >
          업로드하기
        </Button>
        <Button
          onClick={onSkip}
          className="w-full h-12 bg-[#E0E0E0] hover:bg-[#D0D0D0] text-foreground font-medium rounded-full shadow-none text-base"
        >
          나중에 할래요
        </Button>
      </div>
    </div>
  );
}
