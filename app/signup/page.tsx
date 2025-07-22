"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Lock, User, Sparkles, CheckCircle, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isVisible, setIsVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  
  const { signup, signInWithGoogle, isLoading, error, clearError } = useAuth()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long")
      return false
    }
    setValidationError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
  }

  const handleGoogleSignUp = async () => {
    await signInWithGoogle()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    clearError()
    setValidationError(null)
  }

  const benefits = [
    "AI-powered document analysis",
    "Risk assessment & scoring",
    "Hidden clause detection",
    "Interactive document chat",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div
          className={`hidden lg:block space-y-8 transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Join SignAware</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              Start Your Journey to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Legal Clarity
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Join thousands of professionals who trust SignAware to analyze their legal documents and make informed
              decisions.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 group animate-fade-in-left delay-${index * 100}`}
              >
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div
          className={`w-full max-w-md mx-auto transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" prefetch={false} className="inline-flex items-center space-x-2 group">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 h-8 w-8 bg-blue-600/20 rounded-full animate-ping group-hover:animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SignAware
              </span>
            </Link>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">Join SignAware to start analyzing legal documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Display */}
              {(error || validationError) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900">Error</h4>
                      <p className="text-sm text-red-800 mt-1">{error || validationError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Full Name
                  </Label>
                  <div className={`relative transition-all duration-300 ${focusedField === "name" ? "scale-105" : ""}`}>
                    <User
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${focusedField === "name" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "email" ? "scale-105" : ""}`}
                  >
                    <Mail
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${focusedField === "email" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "password" ? "scale-105" : ""}`}
                  >
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${focusedField === "password" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "confirmPassword" ? "scale-105" : ""}`}
                  >
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${focusedField === "confirmPassword" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 transition-all duration-300 hover:scale-105 hover:shadow-lg border-2"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="text-center text-sm">
                <span className="text-slate-600">Already have an account? </span>
                <Link
                  href="/login"
                  prefetch={false}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
