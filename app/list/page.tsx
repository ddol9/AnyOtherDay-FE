'use client'

import { useState } from 'react'
import { ChevronRight, Phone, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ListPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'integrated' | 'self-diagnosis'>(
    'integrated'
  )
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      setShowUploadModal(false)
      // Navigate to self-diagnosis confirmation
      router.push('/')
    }
  }

  // Sample report data grouped by month
  const reportsByMonth = [
    {
      month: '2025. 08',
      reports: [
        {
          id: 1,
          date: '2025.08.05(화)',
          status: '저녁',
          alert: '주의 필요!',
          summary: '통화내용 한줄요약',
        },
        {
          id: 2,
          date: '2025.08.05(화)',
          status: '저녁',
          alert: '주의 필요!',
          summary: '통화내용 한줄요약',
        },
      ],
    },
    {
      month: '2025. 07',
      reports: [
        {
          id: 3,
          date: '2025.07.05(화)',
          status: '저녁',
          alert: null,
          summary: '통화내용 한줄요약',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground mb-4">
          옥순 님의 뇌건강
        </h1>

        {/* Tabs */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('integrated')}
            className={`pb-2 ${
              activeTab === 'integrated'
                ? 'text-[#4291F2] border-b-2 border-[#4291F2] font-semibold'
                : 'text-[#979EA1]'
            }`}
          >
            통합 분석
          </button>
          <button
            onClick={() => setActiveTab('self-diagnosis')}
            className={`pb-2 ${
              activeTab === 'self-diagnosis'
                ? 'text-[#4291F2] border-b-2 border-[#4291F2] font-semibold'
                : 'text-[#979EA1]'
            }`}
          >
            자가진단표
          </button>
        </div>
      </header>

      <div className="px-4">
        {activeTab === 'integrated' && (
          <>
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-sm mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Phone className="w-16 h-16 text-[#4291F2]" strokeWidth={1.5} />
                  <Heart
                    className="w-8 h-8 text-[#FFD86D] absolute -top-1 -right-2"
                    fill="#FFD86D"
                  />
                </div>
              </div>
              <p className="text-center text-foreground mb-4">
                옥순님과의 통화를 들려주세요
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full bg-[#4291F2] text-white py-3 rounded-sm font-medium"
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
                        onClick={() => router.push('/report')}
                        className="bg-white p-4 rounded-sm cursor-pointer"
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

        {activeTab === 'self-diagnosis' && (
          <div className="bg-white p-6 rounded-sm">
            <p className="text-center text-foreground">
              자가진단표 내용이 여기에 표시됩니다.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">
              음성 녹음 파일 업로드
            </h2>
            <p className="text-sm text-foreground/70 mb-4">
              통화 녹음 파일을 선택해주세요
            </p>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-[#4291F2] transition-colors">
                <div className="text-center">
                  <p className="text-sm text-[#979EA1] mb-2">
                    {selectedFile ? selectedFile.name : '파일을 선택하세요'}
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

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                }}
                className="flex-1 py-3 border border-gray-300 rounded-sm text-foreground"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="flex-1 py-3 bg-[#4291F2] text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center gap-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#979EA1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs text-[#979EA1]">홈</span>
          </button>

          <button
            onClick={() => router.push('/list')}
            className="flex flex-col items-center gap-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#4291F2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-xs text-[#4291F2] font-medium">리스트</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#979EA1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs text-[#979EA1]">상담</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#979EA1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs text-[#979EA1]">테스트</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
