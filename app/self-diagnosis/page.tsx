"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Step4 from "@/components/landing/Step4";

export default function SelfDiagnosisPage() {
  const router = useRouter();
  // Step 4 설문 답변 (5개 질문, 각 0-4 값, -1은 미선택)
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([
    -1, -1, -1, -1, -1,
  ]);
  // 사용자 이름 (localStorage에서 가져오거나 기본값)
  const [userName, setUserName] = useState("옥순");

  // localStorage에서 이전 설문 답변 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAnswers = localStorage.getItem("surveyAnswers");
      const savedName = localStorage.getItem("userName");

      if (savedAnswers) {
        try {
          const parsed = JSON.parse(savedAnswers);
          if (Array.isArray(parsed) && parsed.length === 5) {
            setSurveyAnswers(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved survey answers", e);
        }
      }

      if (savedName) {
        setUserName(savedName);
      }
    }
  }, []);

  const handleSurveyAnswerChange = (questionIndex: number, value: number) => {
    setSurveyAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    // 설문 답변 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("surveyAnswers", JSON.stringify(surveyAnswers));
    }

    // 임시 데이터 저장 로직
    console.log("[v0] Self-diagnosis data:", {
      surveyAnswers,
    });
    router.push("/loading");
  };

  const canSubmit = surveyAnswers.every((answer) => answer !== -1);

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background px-4 py-3 border-b">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">자가진단표 수정</h1>
        </div>
      </header>

      {/* Step4 설문 컴포넌트 */}
      <div className="relative min-h-[calc(100vh-80px)] overflow-y-auto">
        <Step4
          userName={userName}
          surveyAnswers={surveyAnswers}
          onAnswerChange={handleSurveyAnswerChange}
        />

        {/* 하단 고정 버튼 */}
        <div className="sticky bottom-0 bg-white px-8 py-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-full disabled:opacity-50 shadow-none"
            style={{ fontSize: "20px" }}
          >
            수정 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
