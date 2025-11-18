'use client'

import { useState } from 'react'
import { Construction, Home, List, MessageCircle, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('test')

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-8">
              <Construction className="h-20 w-20 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              준비중입니다
            </h2>
            <p className="text-base text-muted-foreground">
              더 나은 서비스로 찾아뵙겠습니다
            </p>
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
