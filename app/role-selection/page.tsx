"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Scale, User, CheckCircle } from "lucide-react"

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const roles = [
    {
      id: "legal-professional",
      title: "Legal Professional",
      description: "For lawyers, paralegals, and legal consultants",
      icon: Scale,
      features: [
        "Advanced legal analysis tools",
        "Bulk document processing",
        "Client collaboration features",
        "Detailed compliance reports",
        "Priority support",
      ],
      color: "border-blue-200 hover:border-blue-300",
    },
    {
      id: "individual-user",
      title: "Individual User",
      description: "For personal document review and analysis",
      icon: User,
      features: [
        "Personal document analysis",
        "Risk assessment summaries",
        "Plain language explanations",
        "Document chat interface",
        "Privacy-focused processing",
      ],
      color: "border-green-200 hover:border-green-300",
    },
  ]

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)

    // Simulate API call to save role preference
    await new Promise((resolve) => setTimeout(resolve, 1500))

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">SignAware</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Role</h1>
          <p className="text-lg text-slate-600">
            Select how you plan to use SignAware to get a personalized experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 ${role.color} ${
                  isSelected ? "ring-2 ring-blue-500 shadow-lg scale-105" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <div className="relative">
                    <Icon className={`h-12 w-12 mx-auto mb-4 ${isSelected ? "text-blue-600" : "text-slate-600"}`} />
                    {isSelected && (
                      <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-green-600 bg-white rounded-full" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? "Setting up your account..." : "Continue to Dashboard"}
          </Button>

          {!selectedRole && <p className="text-sm text-slate-500 mt-2">Please select a role to continue</p>}
        </div>
      </div>
    </div>
  )
}
