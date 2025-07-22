"use client";

import type React from "react";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  FileText,
  MessageCircle,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Define types for the analysis data
interface AnalysisData {
  document_id: string;
  status: string;
  analysis: {
    summary: string;
    hidden_clauses: string[];
    risk_assessment: string;
    loopholes: string[];
    red_flags: string[];
    risk_score: number;
    confidence_rating: number;
    key_concerns: string[];
    analyzed_at: string;
  };
  processing_started_at: string;
  processing_completed_at: string;
  error_message: string | null;
}

interface ChatMessage {
  id: number;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
}

function ResultsPageContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I've analyzed your document. Feel free to ask me any questions about the terms, risks, or specific clauses.",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    // Load analysis data from localStorage or API
    const loadAnalysisData = () => {
      try {
        const storedData = localStorage.getItem("analysisResult");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setAnalysisData(parsedData);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading analysis data:", err);
        setError("Failed to load analysis data");
        setIsLoading(false);
      }
    };

    loadAnalysisData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, streamingMessage]);

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setStreamingMessage("");

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingMessage((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            content: text,
            timestamp: new Date(),
          },
        ]);
        setStreamingMessage("");
      }
    }, 30);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    // Generate bot response based on analysis data
    const generateResponse = () => {
      if (!analysisData) {
        return "I don't have access to the analysis data at the moment. Please try again later.";
      }

      const userQuestion = newMessage.toLowerCase();

      if (userQuestion.includes("risk") || userQuestion.includes("score")) {
        return `The overall risk score for this document is ${analysisData.analysis.risk_score}/5. ${analysisData.analysis.risk_assessment}`;
      } else if (
        userQuestion.includes("concern") ||
        userQuestion.includes("issue")
      ) {
        const concerns = analysisData.analysis.key_concerns;
        const randomConcern =
          concerns[Math.floor(Math.random() * concerns.length)];
        return `One key concern is: ${randomConcern}`;
      } else if (
        userQuestion.includes("flag") ||
        userQuestion.includes("red")
      ) {
        const flags = analysisData.analysis.red_flags;
        const randomFlag = flags[Math.floor(Math.random() * flags.length)];
        return `A red flag identified: ${randomFlag}`;
      } else if (userQuestion.includes("loophole")) {
        if (analysisData.analysis.loopholes.length > 0) {
          const loophole =
            analysisData.analysis.loopholes[
              Math.floor(Math.random() * analysisData.analysis.loopholes.length)
            ];
          return `A potential loophole: ${loophole}`;
        } else {
          return "No specific loopholes were identified in this document.";
        }
      } else {
        return "Based on the document analysis, I can help you understand the risks, concerns, and key findings. What specific aspect would you like to know more about?";
      }
    };

    const response = generateResponse();
    setNewMessage("");

    setTimeout(() => {
      simulateTyping(response);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300";
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 4) return "text-red-600";
    if (score >= 3) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskGradient = (score: number) => {
    if (score >= 4) return "from-red-500 to-red-600";
    if (score >= 3) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-slate-600">{error}</p>
          <Link href="/analyze">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Back to Analysis
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg text-slate-600">Analysis data not available.</p>
          <Link href="/analyze">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Back to Analysis
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // At this point, analysisData is guaranteed to be non-null due to early returns above
  if (!analysisData) {
    return null; // This should never happen due to checks above
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-slate-600">{error}</p>
          <Link href="/analyze">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Back to Analysis
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg text-slate-600">
            No analysis data found for this document.
          </p>
          <Link href="/analyze">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Back to Analysis
            </Button>
          </Link>
        </div>
      </div>
    );
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
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Analysis Complete
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Document Analysis Results
              </h1>
              <p className="text-lg text-slate-600">
                Document ID: {analysisData.document_id}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-2">
                Overall Risk Score
              </div>
              <div className="relative">
                <div
                  className={`text-4xl font-bold ${getRiskColor(
                    analysisData.analysis.risk_score
                  )} animate-pulse`}
                >
                  {analysisData.analysis.risk_score}/5
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <TrendingUp
                    className={`h-4 w-4 ${getRiskColor(
                      analysisData.analysis.risk_score
                    )}`}
                  />
                  <span className="text-sm text-slate-500">
                    Risk Assessment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div
            className={`lg:col-span-2 space-y-6 transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
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
                  value="red_flags"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Red Flags
                </TabsTrigger>
                <TabsTrigger
                  value="concerns"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                >
                  Key Concerns
                </TabsTrigger>
                <TabsTrigger
                  value="assessment"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  Risk Assessment
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
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {analysisData.analysis.summary}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="red_flags" className="space-y-4">
                {analysisData.analysis.red_flags.length > 0 ? (
                  analysisData.analysis.red_flags.map((flag, index) => (
                    <Card
                      key={index}
                      className={`shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500 hover:scale-102 animate-fade-in-up delay-${
                        index * 100
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Red Flag #{index + 1}
                          </CardTitle>
                          <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 border-2 font-semibold px-3 py-1">
                            HIGH
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 leading-relaxed">{flag}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500">
                    <CardContent className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-slate-600">
                        No red flags identified in this document.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="concerns" className="space-y-4">
                {analysisData.analysis.key_concerns.map((concern, index) => (
                  <Card
                    key={index}
                    className={`shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500 hover:scale-102 animate-fade-in-up delay-${
                      index * 100
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          Concern #{index + 1}
                        </CardTitle>
                        <div className="text-2xl font-bold text-yellow-600 animate-pulse">
                          ⚠️
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">
                        {concern}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4">
                <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg animate-pulse">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Risk Assessment
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-4">
                      <Progress
                        value={analysisData.analysis.risk_score * 20}
                        className="h-3"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${getRiskGradient(
                          analysisData.analysis.risk_score
                        )} rounded-full opacity-20 animate-pulse`}
                      ></div>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {analysisData.analysis.risk_assessment}
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Confidence Rating:</strong>{" "}
                        {analysisData.analysis.confidence_rating}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Section */}
          <div
            className={`lg:col-span-1 transition-all duration-1000 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Card className="h-[700px] flex flex-col shadow-2xl bg-white/90 backdrop-blur-xl border-0 hover:shadow-3xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-white/20 p-2 rounded-lg animate-pulse">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span>Document Chat</span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Ask questions about your document
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.type === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-gradient-to-r from-slate-200 to-slate-300"
                          }`}
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
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
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
                            <span className="animate-pulse text-blue-500 font-bold">
                              |
                            </span>
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
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">
              Loading analysis results...
            </p>
          </div>
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}
