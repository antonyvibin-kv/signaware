"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Upload, FileText, ArrowLeft, AlertCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useAnalysis } from "@/hooks/useAnalysis"
import { AnalysisRequest } from "@/lib/api"

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [textContent, setTextContent] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { isLoading, uploadProgress, error, submitAnalysis, clearError } = useAnalysis()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      clearError()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      clearError()
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile && !textContent.trim()) {
      return
    }

    const request: AnalysisRequest = {}
    
    if (selectedFile) {
      request.file = selectedFile
    } else if (textContent.trim()) {
      request.text = textContent.trim()
    }

    await submitAnalysis(request)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" prefetch={false}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-slate-900">SignAware</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analyze Document</h1>
          <p className="text-lg text-slate-600">
            Upload a legal document or paste text to get detailed analysis and risk assessment
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900">Error</h4>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Document Input</CardTitle>
            <CardDescription>Choose how you'd like to provide your document for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="text">Paste Text</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                  />

                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <FileText className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">{selectedFile.name}</h3>
                        <p className="text-slate-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="outline" onClick={openFileDialog}>
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Upload className="h-8 w-8 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">Drop your document here</h3>
                        <p className="text-slate-600">or click to browse files</p>
                      </div>
                      <Button onClick={openFileDialog}>Choose File</Button>
                      <p className="text-sm text-slate-500">Supports PDF, DOC, DOCX, and TXT files up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {isLoading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Paste your legal document text here..."
                  className="min-h-[300px] resize-none"
                  value={textContent}
                  onChange={(e) => {
                    setTextContent(e.target.value)
                    clearError()
                  }}
                />
                <p className="text-sm text-slate-500">Paste the full text of your legal document for analysis</p>
              </TabsContent>
            </Tabs>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Privacy & Security</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Your documents are processed securely with advanced encryption. Sensitive information is
                    automatically masked before analysis to protect your privacy.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={(!selectedFile && !textContent.trim()) || isLoading}
                className="px-8 py-3 text-lg"
              >
                {isLoading ? "Analyzing Document..." : "Analyze Document"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
