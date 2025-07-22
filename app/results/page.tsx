"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  ArrowLeft,
  AlertTriangle,
  FileText,
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot" as const,
      content:
        "Hello! I've analyzed your document. Feel free to ask me any questions about the terms, risks, or specific clauses.",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, streamingMessage])

  const simulateTyping = (text: string) => {
    setIsTyping(true)
    setStreamingMessage("")

    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingMessage((prev) => prev + text[index])
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            content: text,
            timestamp: new Date(),
          },
        ])
        setStreamingMessage("")
      }
    }, 30)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      type: "user" as const,
      content: newMessage,
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, userMessage])

    // Simulate bot response
    const responses = [
      "Based on the document analysis, this clause could potentially limit your rights in case of disputes. The arbitration requirement means you cannot pursue class action lawsuits.",
      "This section contains a data retention policy that allows the company to keep your personal information for up to 7 years after account closure, which is longer than industry standard.",
      "The automatic renewal clause is concerning because it requires 60 days notice to cancel, and the cancellation process is not clearly outlined in the document.",
      "This liability limitation clause significantly reduces the company's responsibility for damages, even in cases of negligence or data breaches.",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    setNewMessage("")

    setTimeout(() => {
      simulateTyping(randomResponse)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const analysisData = {
    riskScore: 7.2,
    documentTitle: "Terms of Service - TechCorp Platform",
    summary:
      "This Terms of Service agreement contains several concerning clauses that significantly favor the service provider. Key issues include broad liability limitations, automatic data collection rights, and restrictive dispute resolution requirements.",
    loopholes: [
      {
        title: "Unilateral Terms Modification",
        description:
          "The company reserves the right to modify terms at any time without explicit user consent, only requiring email notification.",
        severity: "high",
      },
      {
        title: "Broad Data Usage Rights",
        description:
          "Vague language grants extensive rights to use, modify, and distribute user-generated content for commercial purposes.",
        severity: "high",
      },
      {
        title: "Limited Liability Coverage",
        description:
          "Liability is capped at the amount paid in the last 12 months, which may be insufficient for actual damages.",
        severity: "medium",
      },
    ],
    risks: [
      {
        category: "Privacy",
        score: 8,
        description: "Extensive data collection with broad usage rights and third-party sharing permissions.",
      },
      {
        category: "Financial",
        score: 6,
        description: "Automatic billing renewal with complex cancellation procedures.",
      },
      {
        category: "Legal",
        score: 8,
        description: "Mandatory arbitration clause prevents class action lawsuits.",
      },
    ],
    concerns: [
      "Automatic renewal with 60-day cancellation notice requirement",
      "Arbitration clause limits legal recourse options",
      "Data retention policy extends beyond account closure",
      "Indemnification clause transfers liability to users",
      "Intellectual property assignment is overly broad",
    ],
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return "text-red-600"
    if (score >= 6) return "text-yellow-600"
    return "text-green-600"
  }

  const getRiskGradient = (score: number) => {
    if (score >= 8) return "from-red-500 to-red-600"
    if (score >= 6) return "from-yellow-500 to-yellow-600"
    return "from-green-500 to-green-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/analyze" prefetch={false}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Shield className="h-6 w-6 text-blue-600 animate-pulse" />
                  <div className="absolute inset-0 h-6 w-6 bg-blue-600/20 rounded-full animate-ping"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SignAware
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Analysis Complete</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Document Analysis Results
              </h1>
              <p className="text-lg text-slate-600">{analysisData.documentTitle}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-2">Overall Risk Score</div>
              <div className="relative">
                <div className={`text-4xl font-bold ${getRiskColor(analysisData.riskScore)} animate-pulse`}>
                  {analysisData.riskScore}/10
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <TrendingUp className={`h-4 w-4 ${getRiskColor(analysisData.riskScore)}`} />
                  <span className="text-sm text-slate-500">Risk Assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div
            className={`lg:col-span-2 space-y-6 transition-all duration-1000 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="loopholes"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Loopholes
                </TabsTrigger>
                <TabsTrigger
                  value="risks"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                >
                  Risk Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="concerns"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  Key Concerns
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Document Summary
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed text-lg">{analysisData.summary}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loopholes" className="space-y-4">
                {analysisData.loopholes.map((loophole, index) => (
                  <Card
                    key={index}
                    className={`shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500 hover:scale-102 animate-fade-in-up delay-${index * 100}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {loophole.title}
                        </CardTitle>
                        <Badge className={`${getSeverityColor(loophole.severity)} border-2 font-semibold px-3 py-1`}>
                          {loophole.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">{loophole.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                {analysisData.risks.map((risk, index) => (
                  <Card
                    key={index}
                    className={`shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500 hover:scale-102 animate-fade-in-up delay-${index * 100}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          {risk.category} Risk
                        </CardTitle>
                        <div className={`text-2xl font-bold ${getRiskColor(risk.score)} animate-pulse`}>
                          {risk.score}/10
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-4">
                        <Progress value={risk.score * 10} className="h-3" />
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${getRiskGradient(risk.score)} rounded-full opacity-20 animate-pulse`}
                        ></div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{risk.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="concerns" className="space-y-4">
                <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg animate-pulse">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Key Concerns
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Important issues you should be aware of before agreeing to this document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {analysisData.concerns.map((concern, index) => (
                        <li
                          key={index}
                          className={`flex items-start space-x-4 group p-3 rounded-lg hover:bg-yellow-50 transition-all duration-300 animate-fade-in-left delay-${index * 100}`}
                        >
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-slate-700 group-hover:text-slate-900 transition-colors duration-300 leading-relaxed">
                            {concern}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Section */}
          <div
            className={`lg:col-span-1 transition-all duration-1000 delay-400 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Card className="h-[700px] flex flex-col shadow-2xl bg-white/90 backdrop-blur-xl border-0 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-white/20 p-2 rounded-lg animate-pulse">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span>Document Chat</span>
                </CardTitle>
                <CardDescription className="text-blue-100">Ask questions about your document</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${message.type === "user" ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-slate-200 to-slate-300"}`}
                        >
                          {message.type === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-slate-600" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                              : "bg-white text-slate-900 border border-slate-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Streaming message */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-[80%]">
                        <div className="p-2 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse">
                          <Bot className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="p-3 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-lg">
                          <p className="text-sm leading-relaxed">
                            {streamingMessage}
                            <span className="animate-pulse text-blue-500 font-bold">|</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t bg-white p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about the document..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isTyping}
                      className="border-2 focus:border-blue-500 transition-all duration-300 focus:shadow-lg"
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
