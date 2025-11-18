'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, MessageCircle, ClipboardList } from 'lucide-react'

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/list', label: '리스트', icon: List },
    { href: '/consultation', label: '상담', icon: MessageCircle },
    { href: '/test', label: '테스트', icon: ClipboardList },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto w-full flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
