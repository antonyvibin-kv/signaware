import { useState, useEffect } from 'react'
import { apiService, DashboardResponse } from '@/lib/api'

interface UseDashboardReturn {
  data: DashboardResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const dashboardData = await apiService.getDashboard()
      setData(dashboardData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(errorMessage)
      console.error('Dashboard fetch failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const refetch = async () => {
    await fetchDashboard()
  }

  return {
    data,
    isLoading,
    error,
    refetch,
  }
} 