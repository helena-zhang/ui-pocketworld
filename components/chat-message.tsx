"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  actions?: Array<{
    type: string
    component: React.ReactNode
  }>
}

export function ChatMessage({ role, content, actions }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex",
      role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        "max-w-[80%]",
        role === 'user' ? 'text-right' : 'text-left'
      )}>
        <Card className={cn(
          "inline-block px-4 py-3 rounded-2xl",
          role === 'user' 
            ? 'bg-blue-500 text-white' 
            : 'glass-effect'
        )}>
          <p className="text-sm">{content}</p>
          {actions?.map((action, index) => (
            <div key={index}>{action.component}</div>
          ))}
        </Card>
      </div>
    </div>
  )
}