'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function SelfDiagnosisPage() {
  const router = useRouter()
  const [speechSlowness, setSpeechSlowness] = useState('모름')
  const [pronunciationIssue, setPronunciationIssue] = useState('모름')
  const [memoryChange, setMemoryChange] = useState('모름')
  const [medicalHistory, setMedicalHistory] = useState('고혈압, 당뇨')

  const handleSubmit = () => {
    // 임시 데이터 저장 로직
    console.log('[v0] Self-diagnosis data:', {
      speechSlowness,
      pronunciationIssue,
      memoryChange,
      medicalHistory
    })
    router.push('/loading')
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background px-4 py-3 border-b border-border">
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

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 pt-6 pb-6 space-y-6">
        <Card className="bg-card border-0 p-5 rounded-md space-y-6">
          {/* 말이 느려졌나요? */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              말이 느려졌나요?
            </Label>
            <RadioGroup value={speechSlowness} onValueChange={setSpeechSlowness}>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="예" id="speech-yes" />
                  <Label htmlFor="speech-yes" className="text-sm cursor-pointer">예</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="아니오" id="speech-no" />
                  <Label htmlFor="speech-no" className="text-sm cursor-pointer">아니오</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="모름" id="speech-unknown" />
                  <Label htmlFor="speech-unknown" className="text-sm cursor-pointer">모름</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 발음이 부정확해졌나요? */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              발음이 부정확해졌나요?
            </Label>
            <RadioGroup value={pronunciationIssue} onValueChange={setPronunciationIssue}>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="예" id="pronunciation-yes" />
                  <Label htmlFor="pronunciation-yes" className="text-sm cursor-pointer">예</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="아니오" id="pronunciation-no" />
                  <Label htmlFor="pronunciation-no" className="text-sm cursor-pointer">아니오</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="모름" id="pronunciation-unknown" />
                  <Label htmlFor="pronunciation-unknown" className="text-sm cursor-pointer">모름</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 최근 기억력 변화가 있었나요? */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              최근 기억력 변화가 있었나요?
            </Label>
            <RadioGroup value={memoryChange} onValueChange={setMemoryChange}>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="예" id="memory-yes" />
                  <Label htmlFor="memory-yes" className="text-sm cursor-pointer">예</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="아니오" id="memory-no" />
                  <Label htmlFor="memory-no" className="text-sm cursor-pointer">아니오</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="모름" id="memory-unknown" />
                  <Label htmlFor="memory-unknown" className="text-sm cursor-pointer">모름</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 기저질환/과거력 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              기저질환/과거력
            </Label>
            <Textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="기저질환이나 과거력을 입력해주세요"
              className="min-h-[100px] rounded-md border-border"
            />
          </div>
        </Card>

        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-md text-base"
        >
          수정 완료
        </Button>
      </main>
    </div>
  )
}
