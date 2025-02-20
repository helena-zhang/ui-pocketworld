"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Home, Settings, ClipboardList, User, Command } from "lucide-react"
import { useState, useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Clear session storage when landing page mounts
  useEffect(() => {
    sessionStorage.clear()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const workflow = formData.get('workflow')
    if (workflow) {
      setIsTransitioning(true)
      // Store the workflow description in sessionStorage
      sessionStorage.setItem('workflowDescription', workflow.toString())
      // Add a small delay for the animation
      setTimeout(() => {
        router.push('/chat')
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-rose-50/30 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-rose-950/30" />
      
      {/* Floating orbs with improved animations */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-200/20 dark:bg-purple-900/20 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-200/20 dark:bg-blue-900/20 blur-[100px] animate-float-slower" />
      
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-20 glass-effect z-50">
        <div className="flex flex-col items-center py-8 space-y-8">
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 transition-all hover:bg-white/10 dark:hover:bg-white/5">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 transition-all hover:bg-white/10 dark:hover:bg-white/5">
            <ClipboardList className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 transition-all hover:bg-white/10 dark:hover:bg-white/5">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 transition-all hover:bg-white/10 dark:hover:bg-white/5">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`pl-20 relative flex items-center justify-center min-h-screen transition-transform duration-300 ${isTransitioning ? 'translate-y-[-20px] opacity-0' : ''}`}>
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-gradient mb-4 animate-fade-in">
            What do you want to automate?
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto animate-fade-in-delay">
            Create and deploy custom workflows with AI assistance
          </p>

          <form onSubmit={handleSubmit}>
            <Card className="glass-effect-strong p-1 rounded-2xl animate-slide-up">
              <div className="flex items-center gap-3 p-3">
                <Command className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input 
                  name="workflow"
                  placeholder="Describe your workflow..." 
                  className="flex-grow bg-transparent border-0 focus-visible:ring-0 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}