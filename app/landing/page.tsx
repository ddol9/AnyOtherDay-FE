"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { wardAPI } from "@/lib/api";

type WardFormData = {
  name: string;
  gender: "male" | "female" | "";
  birthDate: string;
  relationship: string;
};

const DUMMY_GUARDIAN = {
  id: 1,
  phone: "010-0000-0000",
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};
import Step1 from "@/components/landing/Step1";
import Step2 from "@/components/landing/Step2";
import Step3 from "@/components/landing/Step3";
import Step4 from "@/components/landing/Step4";
import Step5 from "@/components/landing/Step5";
import Step6 from "@/components/landing/Step6";
import Step7 from "@/components/landing/Step7";

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  // Step 3 폼 데이터
  const [formData, setFormData] = useState<WardFormData>({
    name: "",
    gender: "",
    birthDate: "",
    relationship: "",
  });
  const [wardId, setWardId] = useState<number | null>(null);
  const [wardSubmissionError, setWardSubmissionError] = useState<string | null>(
    null,
  );
  const [isCreatingWard, setIsCreatingWard] = useState(false);

  // Step 4 설문 답변 (5개 질문, 각 0-4 값, 기본 3=보통)
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([3, 3, 3, 3, 3]);
  const [isUpdatingDiagnosis, setIsUpdatingDiagnosis] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);

  // 자동 진행 (Step 1, 2는 3초 후 자동 진행)
  useEffect(() => {
    if (currentStep === 1 || currentStep === 2) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Step 7 이후 자동으로 리포트 페이지로 이동
  useEffect(() => {
    if (currentStep === 7) {
      const timer = setTimeout(() => {
        router.push("/report");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // 사용자 이름 저장
      if (field === "name" && typeof window !== "undefined") {
        localStorage.setItem("userName", value);
      }
      return updated;
    });
    setWardSubmissionError(null);
  };

  const handleSurveyAnswerChange = (questionIndex: number, value: number) => {
    setSurveyAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      // 설문 답변 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("surveyAnswers", JSON.stringify(newAnswers));
      }
      return newAnswers;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setShowUploadModal(false);
      setCurrentStep(6); // 업로드 후 Step 6으로 이동
    }
  };

  const handleSkip = () => {
    router.push("/"); // "나중에할래요" 클릭 시 메인 페이지로 이동
  };

  const handleStep4Next = async () => {
    if (!wardId) {
      setDiagnosisError("Ward ID가 없습니다.");
      return;
    }

    if (!canProceedFromStep4 || isUpdatingDiagnosis) {
      return;
    }

    setIsUpdatingDiagnosis(true);
    setDiagnosisError(null);

    try {
      // 설문 질문 정의
      const questions = [
        "옷 단추를 잠그기 힘들거나 젓가락을 사용하기 어렵다",
        "물건을 사거나 요금을 지불하는 것이 어렵다",
        "집안일을 하거나 취미 활동을 하기 어렵다",
        "대화 중 단어를 떠올리기 어렵거나 말이 막힌다",
        "오늘 날짜나 요일을 기억하기 어렵다",
      ];

      // 질문과 답변을 매핑한 객체 생성
      const surveyMap: Record<string, number> = {};
      questions.forEach((question, index) => {
        surveyMap[question] = surveyAnswers[index];
      });

      // 설문 답변을 diagnosis JSON으로 포맷팅
      const diagnosisData = {
        answered: true,
        survey: surveyMap,
        completedAt: new Date().toISOString(),
      };

      await wardAPI.updateDiagnosis(wardId, diagnosisData);

      // 설문 답변 제출 완료, 다음 단계로 이동
      setCurrentStep(5);
    } catch (error) {
      console.error("자가진단 업데이트 중 오류 발생:", error);
      const message =
        error instanceof Error
          ? error.message
          : "자가진단 저장에 실패했습니다.";
      setDiagnosisError(message);
    } finally {
      setIsUpdatingDiagnosis(false);
    }
  };

  const canProceedFromStep3 =
    formData.name &&
    formData.gender &&
    formData.birthDate &&
    formData.relationship;
  const canProceedFromStep4 = surveyAnswers.every((answer) => answer !== -1);

  const handleWardSubmit = async () => {
    if (!canProceedFromStep3 || isCreatingWard) {
      return;
    }

    if (wardId) {
      setCurrentStep(4);
      return;
    }

    setIsCreatingWard(true);
    setWardSubmissionError(null);

    try {
      const age = calculateAge(formData.birthDate);
      const payload = {
        guardianId: DUMMY_GUARDIAN.id,
        name: formData.name,
        age,
        gender: formData.gender as "male" | "female",
        phone: DUMMY_GUARDIAN.phone,
        relationship: formData.relationship,
        diagnosis: JSON.stringify({
          source: "onboarding",
          relationship: formData.relationship,
        }),
      };

      const response = await wardAPI.createWard(payload);
      const createdWardId = response?.wardId ?? response?.id ?? null;

      if (createdWardId) {
        setWardId(createdWardId);
        if (typeof window !== "undefined") {
          localStorage.setItem("wardId", String(createdWardId));
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("wardProfile", JSON.stringify(payload));
      }

      setCurrentStep(4);
    } catch (error) {
      console.error("피보호자 등록 중 오류 발생:", error);
      const message =
        error instanceof Error
          ? error.message
          : "피보호자 등록에 실패했습니다.";
      setWardSubmissionError(message);
    } finally {
      setIsCreatingWard(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Step 1 */}
      {currentStep === 1 && <Step1 />}

      {/* Step 2 */}
      {currentStep === 2 && <Step2 />}

      {/* Step 3 */}
      {currentStep === 3 && (
        <div className="relative h-screen">
          <Step3
            formData={formData}
            onFormChange={handleFormChange}
            isSubmitting={isCreatingWard}
            errorMessage={wardSubmissionError}
          />
          <div className="absolute bottom-8 left-0 right-0 px-4 max-w-md mx-auto">
            <Button
              onClick={handleWardSubmit}
              disabled={!canProceedFromStep3 || isCreatingWard}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-none disabled:opacity-50 text-base"
            >
              {isCreatingWard ? "등록 중..." : "다음"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {currentStep === 4 && (
        <div className="relative h-screen overflow-y-auto">
          <Step4
            userName={formData.name}
            surveyAnswers={surveyAnswers}
            onAnswerChange={handleSurveyAnswerChange}
          />
          <div className="sticky bottom-0 bg-white px-4 py-4 max-w-md mx-auto w-full">
            <Button
              onClick={handleStep4Next}
              disabled={!canProceedFromStep4 || isUpdatingDiagnosis}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-none disabled:opacity-50 text-base"
            >
              {isUpdatingDiagnosis ? "저장 중..." : "다음"}
            </Button>
            {diagnosisError && (
              <p className="mt-2 text-center text-sm text-red-500">
                {diagnosisError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 5 */}
      {currentStep === 5 && (
        <Step5 onUpload={() => setShowUploadModal(true)} onSkip={handleSkip} />
      )}

      {/* Step 6 */}
      {currentStep === 6 && <Step6 onNext={() => setCurrentStep(7)} />}

      {/* Step 7 */}
      {currentStep === 7 && <Step7 />}

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white w-full max-w-sm p-6 rounded-md shadow-none">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  음성 녹음 파일 업로드
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="h-8 w-8 rounded-md shadow-none"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a"
                    onChange={handleFileChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        파일을 선택하세요
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP3, WAV, M4A 형식 지원
                      </p>
                    </div>
                  </label>
                </div>

                {selectedFile && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-full disabled:opacity-50 shadow-none text-base"
                >
                  업로드
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
