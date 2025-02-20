"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Code, Plus, Wand2, Sparkles, RefreshCw, Trash2 } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { WorkflowDiagram } from "@/components/workflow-diagram"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Helper function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

interface WorkflowStep {
  id: string
  title: string
  description: string
  type: 'input' | 'process' | 'decision' | 'output'
}

export default function ChatPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    workflow?: WorkflowStep[];
    actions?: Array<{
      type: 'upload' | 'confirm' | 'other';
      component: React.ReactNode;
    }>;
  }>>([])

  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStep[]>([])
  const [isEditingWorkflow, setIsEditingWorkflow] = useState(false)
  const [suggestions] = useState([
    "Add input validation",
    "Include error handling",
    "Add data persistence",
    "Implement user authentication"
  ])

  useEffect(() => {
    const workflowDescription = sessionStorage.getItem('workflowDescription')
    if (!workflowDescription) {
      router.replace('/')
      return
    }

    const userMessageId = generateId()
    setMessages([{
      id: userMessageId,
      role: 'user',
      content: workflowDescription,
      actions: []
    }])

    const initialWorkflow = [
      {
        id: 'input',
        title: 'Data Input',
        description: 'Collect required data',
        type: 'input'
      },
      {
        id: 'process',
        title: 'Process Data',
        description: 'Apply business logic',
        type: 'process'
      },
      {
        id: 'output',
        title: 'Generate Output',
        description: 'Create final result',
        type: 'output'
      }
    ]

    setCurrentWorkflow(initialWorkflow)
    const aiMessageId = generateId()
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: aiMessageId,
        role: 'assistant',
        content: "I've analyzed your request and created an interactive workflow. You can modify it by clicking and dragging the nodes, or edit their properties directly.",
        workflow: initialWorkflow,
        actions: [{
          type: 'confirm',
          component: (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 glass-effect group relative overflow-hidden"
                  onClick={() => setIsEditingWorkflow(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Plus className="h-4 w-4 mr-2" />
                  Edit Workflow
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 glass-effect group relative overflow-hidden"
                  onClick={() => {
                    sessionStorage.setItem('currentWorkflow', JSON.stringify(currentWorkflow))
                    sessionStorage.setItem('chatHistory', JSON.stringify(messages))
                    router.push('/editor')
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Code className="h-4 w-4 mr-2" />
                  Open Editor
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="glass-effect cursor-pointer hover:bg-blue-500/10 transition-colors">
                  <Wand2 className="h-3 w-3 mr-1" /> Optimize
                </Badge>
                <Badge variant="outline" className="glass-effect cursor-pointer hover:bg-purple-500/10 transition-colors">
                  <Sparkles className="h-3 w-3 mr-1" /> Enhance
                </Badge>
                <Badge variant="outline" className="glass-effect cursor-pointer hover:bg-green-500/10 transition-colors">
                  <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
                </Badge>
              </div>
            </div>
          )
        }]
      }])
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleSend = async (message: string) => {
    const userMessageId = generateId()
    const aiMessageId = generateId()

    setMessages(prev => [...prev, {
      id: userMessageId,
      role: 'user',
      content: message
    }])

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: aiMessageId,
        role: 'assistant',
        content: "I understand. Here are some suggestions to improve the workflow:",
        actions: [{
          type: 'confirm',
          component: (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full glass-effect group relative overflow-hidden"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-xs">{suggestion}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to add this suggestion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )
        }]
      }])
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    const newStep: WorkflowStep = {
      id: generateId(),
      title: suggestion,
      description: `Implement ${suggestion.toLowerCase()}`,
      type: 'process'
    }
    
    setCurrentWorkflow(prev => [...prev, newStep])
    handleSaveWorkflow('', [...currentWorkflow, newStep])
  }

  const handleSaveWorkflow = (messageId: string, updatedWorkflow: WorkflowStep[]) => {
    setCurrentWorkflow(updatedWorkflow)
    setIsEditingWorkflow(false)
    
    const aiMessageId = generateId()
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: "I've updated the workflow with your changes.",
      workflow: updatedWorkflow,
      actions: [{
        type: 'confirm',
        component: (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 glass-effect group relative overflow-hidden"
                onClick={() => setIsEditingWorkflow(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus className="h-4 w-4 mr-2" />
                Edit Workflow
              </Button>
              <Button 
                variant="outline"
                className="flex-1 glass-effect group relative overflow-hidden"
                onClick={() => {
                  sessionStorage.setItem('currentWorkflow', JSON.stringify(updatedWorkflow))
                  sessionStorage.setItem('chatHistory', JSON.stringify(messages))
                  router.push('/editor')
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code className="h-4 w-4 mr-2" />
                Open Editor
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline" className="glass-effect cursor-pointer hover:bg-blue-500/10 transition-colors">
                  {updatedWorkflow.length} steps
                </Badge>
                <Badge variant="outline" className="glass-effect cursor-pointer hover:bg-green-500/10 transition-colors">
                  Ready to implement
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                onClick={() => setCurrentWorkflow([])}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      }]
    }])
  }

  return (
    <div className={`min-h-screen bg-[#f5f5f7] dark:bg-[#000000] relative transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-rose-50/30 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-rose-950/30" />
      
      <div className="relative flex flex-col h-screen">
        <div className="glass-effect-strong border-b border-white/20 dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-xl font-medium text-gradient">Workflow Assistant</h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="glass-effect">
                  {currentWorkflow.length} steps
                </Badge>
                <Badge variant="outline" className="glass-effect">
                  Interactive Mode
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="max-w-5xl mx-auto h-full px-4 py-6 flex flex-col">
            <Card className="glass-effect-strong overflow-hidden animate-slide-up flex-1 flex flex-col">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-6 py-6">
                  {messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className={`transition-all duration-500 delay-${index * 200} ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                    >
                      <ChatMessage {...message} />
                      {message.workflow && (
                        <div className="mt-4">
                          <WorkflowDiagram
                            steps={message.workflow}
                            isEditable={isEditingWorkflow}
                            onSave={(nodes) => handleSaveWorkflow(message.id, nodes as WorkflowStep[])}
                            onCancel={() => setIsEditingWorkflow(false)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="glass-effect border-t border-white/20 dark:border-white/10 p-4 mt-auto">
                <ChatInput onSend={handleSend} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}