"use client"

import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Home, Settings, ClipboardList, User } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    {
      icon: Home,
      href: '/',
      label: 'Home'
    },
    {
      icon: ClipboardList,
      href: '/workflows',
      label: 'Workflows'
    },
    {
      icon: Settings,
      href: '/settings',
      label: 'Settings'
    }
  ]

  const profile = {
    icon: User,
    href: '/profile',
    label: 'Profile'
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-20 glass-effect z-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center py-8 space-y-8">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 transition-all hover:bg-white/10 dark:hover:bg-white/5 relative group ${
                isActive ? 'bg-white/10 dark:bg-white/5' : ''
              }`}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-5 w-5" />
              <span className="absolute left-14 px-2 py-1 bg-black/80 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
      <div className="pb-8 flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 transition-all hover:bg-white/10 dark:hover:bg-white/5 relative group"
          onClick={() => router.push(profile.href)}
        >
          <User className="h-5 w-5" />
          <span className="absolute left-14 px-2 py-1 bg-black/80 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
            {profile.label}
          </span>
        </Button>
      </div>
    </nav>
  )
}