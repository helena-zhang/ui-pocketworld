"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ChevronDown, 
  File, 
  Folder, 
  Terminal, 
  Settings, 
  Play, 
  Home, 
  ClipboardList, 
  User, 
  Code, 
  Eye, 
  ArrowLeft,
  ThumbsUp,
  ThumbsDown 
} from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Link from 'next/link'

const PreviewPanel = ({ code }: { code: string }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        <div className="glass-effect p-6 rounded-xl">
          <h1 className="text-2xl font-semibold mb-4">Preview Output</h1>
          <div className="prose dark:prose-invert">
            <div className="p-4 bg-white/5 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: code }} />
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Variables</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="font-mono text-xs">count</span>
              <span className="font-mono text-xs text-blue-400">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FileData {
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileData[]
}

export default function EditorPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState('app/page.tsx')
  const [activeTab, setActiveTab] = useState('code')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> Starting development server...',
    '> Ready on http://localhost:3000'
  ])
  const [files] = useState<FileData[]>([
    {
      name: 'app',
      type: 'folder',
      children: [
        { name: 'page.tsx', type: 'file', content: 'export default function Home() {\n  return (\n    <div>Hello World</div>\n  )\n}' },
        { name: 'layout.tsx', type: 'file', content: '' },
        { name: 'globals.css', type: 'file', content: '' }
      ]
    },
    {
      name: 'components',
      type: 'folder',
      children: [
        { name: 'button.tsx', type: 'file', content: '' },
        { name: 'card.tsx', type: 'file', content: '' }
      ]
    }
  ])

  useEffect(() => {
    const chatHistory = sessionStorage.getItem('chatHistory')
    if (chatHistory) {
      setMessages(JSON.parse(chatHistory))
    }
  }, [])

  const handleSend = (message: string) => {
    const newMessages = [...messages, {
      id: `${Date.now()}`,
      role: 'user',
      content: message
    }]
    setMessages(newMessages)
    sessionStorage.setItem('chatHistory', JSON.stringify(newMessages))

    // Simulate AI response
    setTimeout(() => {
      const aiMessageId = generateId()
      setMessages(prev => [...prev, {
        id: aiMessageId,
        role: 'assistant',
        content: "I've analyzed your request. Here's what I can help you with:",
        actions: [{
          type: 'confirm',
          component: (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="glass-effect">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes, proceed
              </Button>
              <Button variant="outline" className="glass-effect">
                <ThumbsDown className="h-4 w-4 mr-2" />
                No, adjust plan
              </Button>
            </div>
          )
        }]
      }])
    }, 1000)
  }

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const getFileContent = (path: string): string => {
    const [folderName, fileName] = path.split('/')
    const folder = files.find(f => f.name === folderName)
    const file = folder?.children?.find(f => f.name === fileName)
    return file?.content || ''
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-rose-50/30 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-rose-950/30" />
      
      <div className="relative h-screen flex">
        <nav className="w-20 glass-effect-strong z-50 flex flex-col items-center py-8 space-y-8 border-r border-white/20 dark:border-white/10">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
            <ClipboardList className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
            <User className="h-5 w-5" />
          </Button>
        </nav>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full glass-effect-strong border-r border-white/20 dark:border-white/10">
              <div className="p-3 text-xs font-medium">EXPLORER</div>
              <ScrollArea className="h-[calc(100vh-40px)]">
                {files.map((file) => (
                  <div key={file.name} className="px-2">
                    <div className="flex items-center gap-1 py-1 hover:bg-white/5 rounded px-2">
                      <ChevronDown className="h-3 w-3" />
                      <Folder className="h-3 w-3 text-blue-400" />
                      <span className="text-xs">{file.name}</span>
                    </div>
                    <div className="ml-4">
                      {file.children?.map((child) => (
                        <div
                          key={child.name}
                          className={`flex items-center gap-1 py-1 hover:bg-white/5 rounded px-2 cursor-pointer ${
                            selectedFile === `${file.name}/${child.name}` ? 'bg-white/10' : ''
                          }`}
                          onClick={() => setSelectedFile(`${file.name}/${child.name}`)}
                        >
                          <File className="h-3 w-3 opacity-60" />
                          <span className="text-xs">{child.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-[2px] bg-white/20 dark:bg-white/10" />

          <ResizablePanel defaultSize={55}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <div className="h-full glass-effect-strong">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="h-9 glass-effect border-b border-white/20 dark:border-white/10 flex items-center px-4">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs opacity-60">{selectedFile}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="w-32">
                        <TabsList className="grid w-full grid-cols-2 h-7">
                          <TabsTrigger value="code" className="text-xs">
                            <Code className="h-3 w-3 mr-1" />
                            Code
                          </TabsTrigger>
                          <TabsTrigger value="preview" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>
                    <div className="h-[calc(100%-36px)]">
                      <TabsContent value="code" className="h-full m-0 data-[state=active]:flex">
                        <ScrollArea className="h-full w-full">
                          <pre className="p-4">
                            <code className="text-xs font-mono">{getFileContent(selectedFile)}</code>
                          </pre>
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="preview" className="h-full m-0 data-[state=active]:flex">
                        <ScrollArea className="h-full w-full">
                          <PreviewPanel code={getFileContent(selectedFile)} />
                        </ScrollArea>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-[2px] bg-white/20 dark:bg-white/10" />

              <ResizablePanel defaultSize={30}>
                <div className="h-full glass-effect-strong">
                  <div className="h-9 glass-effect border-b border-white/20 dark:border-white/10 flex items-center px-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3 w-3" />
                      <span className="text-xs font-medium">TERMINAL</span>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100%-36px)]">
                    <div className="p-4 font-mono text-xs space-y-1">
                      {terminalOutput.map((line, index) => (
                        <div key={index} className="text-gray-400">{line}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle className="w-[2px] bg-white/20 dark:bg-white/10" />

          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full glass-effect-strong">
              <div className="h-full flex flex-col">
                <div className="h-9 glass-effect border-b border-white/20 dark:border-white/10 flex items-center px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">CHAT</span>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="space-y-4 p-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} {...message} />
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 glass-effect border-t border-white/20 dark:border-white/10">
                  <ChatInput onSend={handleSend} />
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}