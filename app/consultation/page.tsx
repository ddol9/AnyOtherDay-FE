'use client'

import { useState } from 'react'
import { MapPin, Phone, Clock, ChevronRight, Home, List, MessageCircle, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function ConsultationPage() {
  const [activeTab, setActiveTab] = useState('consultation')

  // 임시 병원 데이터
  const hospitals = [
    {
      id: 1,
      name: '서울대학교병원',
      department: '신경과',
      distance: '1.2km',
      phone: '02-2072-2114',
      hours: '평일 09:00 - 18:00'
    },
    {
      id: 2,
      name: '삼성서울병원',
      department: '신경과',
      distance: '2.5km',
      phone: '02-3410-2114',
      hours: '평일 08:30 - 17:30'
    },
    {
      id: 3,
      name: '세브란스병원',
      department: '신경과',
      distance: '3.1km',
      phone: '02-2228-5800',
      hours: '평일 09:00 - 18:00'
    }
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="bg-background px-4 py-6 border-b border-border">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-foreground">
            옥순 님에게 도움이 필요한가요?
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 pt-6 pb-6 space-y-6">
        {/* 지도 영역 (임시) */}
        <Card className="bg-card border-0 rounded-sm overflow-hidden h-48">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">지도 표시 영역</p>
            </div>
          </div>
        </Card>

        {/* 우리동네 맞춤 병원 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            우리 동네 맞춤 병원
          </h2>

          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="bg-card border-0 p-4 rounded-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-foreground mb-1">
                        {hospital.name}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {hospital.department}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {hospital.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {hospital.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {hospital.hours}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-sm">
                    전화 연결
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-md mx-auto flex items-center justify-around py-3 px-4">
          <Link href="/">
            <button
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'home' ? 'text-primary' : 'text-secondary'
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs font-medium">홈</span>
            </button>
          </Link>
          <Link href="/list">
            <button
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'list' ? 'text-primary' : 'text-secondary'
              }`}
            >
              <List className="h-6 w-6" />
              <span className="text-xs font-medium">리스트</span>
            </button>
          </Link>
          <Link href="/consultation">
            <button
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'consultation' ? 'text-primary' : 'text-secondary'
              }`}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-medium">상담</span>
            </button>
          </Link>
          <Link href="/test">
            <button
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'test' ? 'text-primary' : 'text-secondary'
              }`}
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-xs font-medium">테스트</span>
            </button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
