"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
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
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    relationship: "",
  });

  // Step 3 ward 정보
  const [wardId, setWardId] = useState<number | null>(null);

  // Step 4 설문 답변 (5개 질문, 각 0-4 값)
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([2, 2, 2, 2, 2]);
  const [isUpdatingDiagnosis, setIsUpdatingDiagnosis] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);

  // Step 5 오디오 업로드
  const [recordId, setRecordId] = useState<number | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Step 6 AI 분석 결과
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [isCheckingReport, setIsCheckingReport] = useState(false);

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
    handleAudioUpload();
  };

  const handleSkip = () => {
    router.push("/"); // "나중에할래요" 클릭 시 메인 페이지로 이동
  };

  const canProceedFromStep3 =
    formData.name &&
    formData.gender &&
    formData.birthDate &&
    formData.relationship;
  const canProceedFromStep4 = surveyAnswers.every((answer) => answer !== -1);

  const handleStep3Submit = async () => {
    if (!canProceedFromStep3) return;

    try {
      const birthDate = new Date(formData.birthDate);
      const age = new Date().getFullYear() - birthDate.getFullYear();

      const wardData = {
        name: formData.name,
        gender: formData.gender === "male" ? "M" : "F",
        birthDate: formData.birthDate,
        age: age,
        relationship: formData.relationship,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wardData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create ward");
      }

      const result = await response.json();
      const newWardId = result.data?.wardId || result.data?.id;

      if (newWardId) {
        setWardId(newWardId);
        localStorage.setItem("wardId", newWardId.toString());
      }

      setCurrentStep(4);
    } catch (error) {
      console.error("Error creating ward:", error);
      alert("피보호자 정보 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleStep4Submit = async () => {
    if (!canProceedFromStep4 || !wardId) return;

    setIsUpdatingDiagnosis(true);
    setDiagnosisError(null);

    try {
      const surveyMap: Record<string, number> = {};
      const questions = [
        "최근 한 달간 기억이 잘 안 나는 일이 있었나요?",
        "일상생활에서 시간을 놓치거나 헷갈린 적이 있나요?",
        "가족이나 친구 이름을 잘 못 떠올린 적이 있나요?",
        "약 복용 시간을 자주 까먹나요?",
        "최근 들은 대화 내용이 기억에 남지 않는 경우가 있나요?",
      ];

      questions.forEach((q, i) => {
        surveyMap[q] = surveyAnswers[i];
      });

      const diagnosisData = {
        answered: true,
        survey: surveyMap,
        completedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wards/${wardId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ diagnosis: JSON.stringify(diagnosisData) }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update diagnosis");
      }

      setCurrentStep(5);
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      setDiagnosisError("진단 정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUpdatingDiagnosis(false);
    }
  };

  const handleAudioUpload = async () => {
    if (!selectedFile || !wardId) {
      setUploadError("파일을 선택하고 다시 시도해주세요.");
      return;
    }

    setIsUploadingAudio(true);
    setUploadError(null);

    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append("file", selectedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/audio-records/ward/${wardId}`,
        {
          method: "POST",
          body: formDataWithFile,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const result = await response.json();
      const newRecordId = result.data?.recordId || result.data?.id;

      if (newRecordId) {
        setRecordId(newRecordId);
        localStorage.setItem("recordId", newRecordId.toString());
        setShowUploadModal(false);
        setSelectedFile(null);
        setCurrentStep(6);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      setUploadError("음성 파일 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const pollReportCompletion = async (recId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/audio-records/${recId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check record status");
      }

      const result = await response.json();
      const status = result.data?.status || result.data?.recordStatus;

      if (status === "completed") {
        const reportResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/record/${recId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (reportResponse.ok) {
          const reportResult = await reportResponse.json();
          const report = reportResult.data || reportResult;
          setAnalysisReport(report);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error polling report:", error);
      return false;
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
          <Step3 formData={formData} onFormChange={handleFormChange} />
          <div className="absolute bottom-8 left-0 right-0 px-4 max-w-md mx-auto">
            <Button
              onClick={handleStep3Submit}
              disabled={!canProceedFromStep3}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-none disabled:opacity-50 text-base"
            >
              다음
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
          <div className="sticky bottom-0 bg-white px-4 py-4 max-w-md mx-auto">
            {diagnosisError && (
              <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {diagnosisError}
              </div>
            )}
            <Button
              onClick={handleStep4Submit}
              disabled={!canProceedFromStep4 || isUpdatingDiagnosis}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-none disabled:opacity-50 text-base"
            >
              {isUpdatingDiagnosis ? "저장 중..." : "다음"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 5 */}
      {currentStep === 5 && (
        <Step5 onUpload={() => setShowUploadModal(true)} onSkip={handleSkip} />
      )}

      {/* Step 6 */}
      {currentStep === 6 && (
        <Step6
          recordId={recordId}
          onNext={() => setCurrentStep(7)}
          onPoll={pollReportCompletion}
        />
      )}

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

                {uploadError && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {uploadError}
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploadingAudio}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-full disabled:opacity-50 shadow-none text-base"
                >
                  {isUploadingAudio ? "업로드 중..." : "업로드"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
