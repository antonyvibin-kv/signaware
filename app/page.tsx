"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileText, Brain, Users, CheckCircle, ArrowRight, Sparkles, Zap, Lock } from "lucide-react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className={`flex items-center space-x-2 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 bg-blue-600/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SignAware
              </span>
            </div>
            <div
              className={`flex items-center space-x-4 transition-all duration-700 delay-200 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <Link href="/login" prefetch={false}>
                <Button variant="ghost" className="hover:bg-blue-50 transition-all duration-300 hover:scale-105">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" prefetch={false}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6 animate-bounce">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI-Powered Legal Analysis</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Read Between the
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Lines
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              AI-powered legal document analysis that reveals hidden clauses, assesses risks, and empowers you to make
              informed decisions before you sign.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" prefetch={false}>
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Start Analyzing Documents
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg border-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Watch Demo</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Legal Clarity Made
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Simple
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to understand legal documents completely
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced AI analyzes complex legal language and identifies hidden clauses automatically.",
                gradient: "from-blue-500 to-cyan-500",
                delay: "delay-100",
              },
              {
                icon: Shield,
                title: "Risk Assessment",
                description: "Get comprehensive risk scores and detailed analysis of potential concerns.",
                gradient: "from-purple-500 to-pink-500",
                delay: "delay-200",
              },
              {
                icon: FileText,
                title: "Interactive Chat",
                description: "Ask questions about your document and get instant, intelligent responses.",
                gradient: "from-indigo-500 to-blue-500",
                delay: "delay-300",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm animate-fade-in-up ${feature.delay}`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Trusted & Secure</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Why Choose
                <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SignAware?
                </span>
              </h2>

              <div className="space-y-4">
                {[
                  "Identify hidden clauses and loopholes",
                  "Get clear risk assessments",
                  "Understand complex legal language",
                  "Make informed decisions confidently",
                  "Protect your interests and privacy",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 group animate-fade-in-left delay-${index * 100}`}
                  >
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-0">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 animate-pulse">
                    <Users className="h-8 w-8 text-white mx-auto" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Trusted by Professionals
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Join thousands of legal professionals and individuals who trust SignAware for document analysis.
                  </p>
                  <Link href="/signup" prefetch={false}>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Get Started Today
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 bg-blue-400/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SignAware
            </span>
          </div>
          <p className="text-slate-400 mb-4 text-lg">
            Empowering informed decisions through AI-powered legal document analysis.
          </p>
          <p className="text-slate-500 text-sm">© 2024 SignAware. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
