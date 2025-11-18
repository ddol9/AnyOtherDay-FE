"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const surveyQuestions = [
  "옷 단추를 잠그기 힘들거나 젓가락을 사용하기 어렵다",
  "물건을 사거나 요금을 지불하는 것이 어렵다",
  "집안일을 하거나 취미 활동을 하기 어렵다",
  "대화 중 단어를 떠올리기 어렵거나 말이 막힌다",
  "오늘 날짜나 요일을 기억하기 어렵다",
];

const surveyScaleLabels = [
  "매우 아니다",
  "아니다",
  "보통",
  "그렇다",
  "매우 그렇다",
];

export default function ListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"integrated" | "self-diagnosis">(
    "integrated",
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savedSurveyAnswers, setSavedSurveyAnswers] = useState<number[] | null>(
    null,
  );
  const [savedUserName, setSavedUserName] = useState("옥순");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setShowUploadModal(false);
      // Navigate to self-diagnosis confirmation
      router.push("/");
    }
  };

  // Sample report data grouped by month
  const reportsByMonth = [
    {
      month: "2025. 08",
      reports: [
        {
          id: 1,
          date: "2025.08.05(화)",
          status: "저녁",
          alert: "주의 필요!",
          summary: "통화내용 한줄요약",
        },
        {
          id: 2,
          date: "2025.08.05(화)",
          status: "저녁",
          alert: "주의 필요!",
          summary: "통화내용 한줄요약",
        },
      ],
    },
    {
      month: "2025. 07",
      reports: [
        {
          id: 3,
          date: "2025.07.05(화)",
          status: "저녁",
          alert: null,
          summary: "통화내용 한줄요약",
        },
      ],
    },
  ];

  useEffect(() => {
    if (activeTab !== "self-diagnosis") return;
    if (typeof window === "undefined") return;

    const storedAnswers = localStorage.getItem("surveyAnswers");
    if (storedAnswers) {
      try {
        const parsed = JSON.parse(storedAnswers);
        if (Array.isArray(parsed) && parsed.length === surveyQuestions.length) {
          setSavedSurveyAnswers(parsed);
        } else {
          setSavedSurveyAnswers(null);
        }
      } catch (error) {
        console.error("Failed to parse survey answers", error);
        setSavedSurveyAnswers(null);
      }
    } else {
      setSavedSurveyAnswers(null);
    }

    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setSavedUserName(storedName);
    }
  }, [activeTab]);

  const headerContent = (
    <div className="px-4 pt-6 pb-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-4">
        옥순 님의 뇌건강
      </h1>

      {/* Tabs */}
      <div className="flex gap-6">
        <button
          onClick={() => setActiveTab("integrated")}
          className={`pb-2 h-12 text-base flex items-end ${
            activeTab === "integrated"
              ? "text-[#4291F2] border-b-2 border-[#4291F2] font-semibold"
              : "text-[#979EA1]"
          }`}
        >
          통합 분석
        </button>
        <button
          onClick={() => setActiveTab("self-diagnosis")}
          className={`pb-2 h-12 text-base flex items-end ${
            activeTab === "self-diagnosis"
              ? "text-[#4291F2] border-b-2 border-[#4291F2] font-semibold"
              : "text-[#979EA1]"
          }`}
        >
          자가진단표
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout hasHeader={true} headerContent={headerContent}>
      <div className="px-4 py-4 max-w-md mx-auto w-full space-y-6">
        {activeTab === "integrated" && (
          <>
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-md shadow-none mb-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/icons/list/list-call.svg"
                  alt="통화 아이콘"
                  width={64}
                  height={64}
                />
              </div>
              <p className="text-center text-foreground mb-4">
                옥순님과의 통화를 들려주세요
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full h-12 bg-[#4291F2] text-white rounded-full shadow-none font-medium text-base"
              >
                업로드하기
              </button>
            </div>

            {/* Reports List */}
            <div className="space-y-6">
              {reportsByMonth.map((monthGroup) => (
                <div key={monthGroup.month}>
                  <h2 className="text-sm text-[#979EA1] mb-3 font-medium">
                    {monthGroup.month}
                  </h2>
                  <div className="space-y-3">
                    {monthGroup.reports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => router.push("/report")}
                        className="bg-white p-4 rounded-md shadow-none cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#979EA1]">
                            {report.date}
                          </span>
                          <span className="text-sm text-[#979EA1]">
                            {report.status}
                          </span>
                        </div>
                        {report.alert && (
                          <p className="text-sm text-red-500 font-medium mb-1">
                            {report.alert}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-base text-foreground font-medium">
                            {report.summary}
                          </p>
                          <ChevronRight className="w-5 h-5 text-[#979EA1]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "self-diagnosis" && (
          <div className="bg-white p-6 rounded-md shadow-none space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground text-center">
                {savedUserName}님의 자가진단표
              </h2>
              <p className="text-sm text-muted-foreground text-center mt-1">
                최근 입력한 문항 결과입니다.
              </p>
            </div>
            {savedSurveyAnswers ? (
              <div className="space-y-3">
                {surveyQuestions.map((question, index) => (
                  <div
                    key={question}
                    className="rounded-lg border border-gray-200 p-4 shadow-none"
                  >
                    <p className="text-sm text-foreground mb-2">{question}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        선택한 답변
                      </span>
                      <span className="text-base font-semibold text-[#4291F2]">
                        {surveyScaleLabels[savedSurveyAnswers[index] ?? 2]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                아직 저장된 자가진단표가 없습니다. 온보딩 또는 자가진단표
                수정에서 입력해 주세요.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md shadow-none p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">
              음성 녹음 파일 업로드
            </h2>
            <p className="text-sm text-foreground/70 mb-4">
              통화 녹음 파일을 선택해주세요
            </p>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#4291F2] transition-colors">
                <div className="text-center">
                  <p className="text-sm text-[#979EA1] mb-2">
                    {selectedFile ? selectedFile.name : "파일을 선택하세요"}
                  </p>
                  <p className="text-xs text-[#979EA1]">MP3, WAV, M4A</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

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

                <div className="space-y-4 w-full">
                  <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="list-audio-upload"
                    />
                    <label
                      htmlFor="list-audio-upload"
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
        </div>
      )}
    </AppLayout>
  );
}
