import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService, LoginRequest, SignupRequest, AuthResponse } from '@/lib/auth'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  signup: (userData: SignupRequest) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        authService.clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleAuthSuccess = useCallback((authResponse: AuthResponse) => {
    authService.setTokens(authResponse.accessToken, authResponse.refreshToken)
    setUser(authResponse.user)
    setError(null)
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const authResponse = await authService.login(credentials)
      handleAuthSuccess(authResponse)
      
      router.push('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [router, handleAuthSuccess])

  const signup = useCallback(async (userData: SignupRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const authResponse = await authService.signup(userData)
      handleAuthSuccess(authResponse)
      
      router.push('/role-selection')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [router, handleAuthSuccess])

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use Firebase Google authentication
      const authResponse = await authService.signInWithFirebaseGoogle()
      handleAuthSuccess(authResponse)
      
      router.push('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [router, handleAuthSuccess])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Still clear local state even if server logout fails
      authService.clearTokens()
      setUser(null)
      router.push('/login')
    }
  }, [router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    signInWithGoogle,
    logout,
    clearError,
  }
} 