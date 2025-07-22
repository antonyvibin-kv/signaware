"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import {
  AlertTriangle,
  Clock,
  FileText,
  History,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading, error, refetch } = useDashboard();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 4)
      return "text-red-600 bg-gradient-to-r from-red-50 to-red-100 border-red-200";
    if (score >= 3)
      return "text-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
    return "text-green-600 bg-gradient-to-r from-green-50 to-green-100 border-green-200";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Terms of Service":
        return "📋";
      case "Employment Contract":
        return "💼";
      case "Privacy Policy":
        return "🔒";
      default:
        return "📄";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-slate-500">Fetching your data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={refetch} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Use API data or fallback to empty state
  const stats = data?.stats || {
    totalAnalyses: 0,
    avgRiskScore: 0,
    thisMonth: 0,
    timeSaved: 0,
  };

  const recentDocuments = data?.recentDocuments || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 bg-blue-600/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SignAware
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Analyze legal documents and understand what you're signing
          </p>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {[
            {
              title: "Total Analyses",
              value: stats.totalAnalyses,
              icon: FileText,
              color: "from-blue-500 to-cyan-500",
            },
            {
              title: "Avg Risk Score",
              value: `${stats.avgRiskScore}/5`,
              icon: TrendingUp,
              color: "from-purple-500 to-pink-500",
            },
            {
              title: "This Month",
              value: stats.thisMonth,
              icon: Clock,
              color: "from-green-500 to-emerald-500",
            },
            {
              title: "Time Saved",
              value: `${stats.timeSaved} hours`,
              icon: AlertTriangle,
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          className={`grid md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link href="/analyze" prefetch={false} className="group">
            <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                  <Plus className="h-8 w-8 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  New Analysis
                </h3>
                <p className="text-slate-600">
                  Upload a document to get started
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 group">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <History className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">
                Recent Analyses
              </h3>
              <p className="text-slate-600">View your analysis history</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 group">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300">
                Templates
              </h3>
              <p className="text-slate-600">Common document templates</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card
          className={`shadow-xl bg-white/80 backdrop-blur-sm border-0 transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Recent Document Analyses
            </CardTitle>
            <CardDescription className="text-base">
              Your latest document analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((document, index) => (
                <div
                  key={document.id}
                  className={`group flex items-center justify-between p-6 border-2 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-102 hover:shadow-lg animate-fade-in-up delay-${
                    index * 100
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 text-2xl">
                      {getTypeIcon(document.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {document.title}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {new Date(document.completedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        document.status === "completed"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : document.status === "processing"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {document.status.charAt(0).toUpperCase() +
                        document.status.slice(1)}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${getRiskColor(
                        document.riskScore
                      )}`}
                    >
                      Risk: {document.riskScore}/5
                    </div>
                    <Link
                      href={`/results?documentId=${document.id}`}
                      prefetch={false}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentDocuments.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-slate-100 to-blue-100 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No analyses yet
                </h3>
                <p className="text-slate-600 mb-6">
                  Upload your first document to get started
                </p>
                <Link href="/analyze" prefetch={false}>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze Document
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
