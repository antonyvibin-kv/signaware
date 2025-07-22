const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://5e44c052f820.ngrok-free.app'
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
  firstName: string
  lastName: string
  role?: 'lawyer' | 'client' | 'admin'
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
  }
  accessToken: string
  refreshToken?: string
}

export interface GoogleAuthRequest {
  token: string
}

export interface UpdateRoleRequest {
  role: string
}

interface FirebaseServiceAccount {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

class AuthService {
  private baseUrl: string
  private firebaseConfig: any = null

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${API_VERSION}`
  }

  private async loadFirebaseConfig(): Promise<any> {
    if (this.firebaseConfig) {
      return this.firebaseConfig
    }

    try {
      // Try to load Firebase config from config file first
      let firebaseConfig = null
      try {
        const configResponse = await fetch('/firebase-config.json')
        if (configResponse.ok) {
          firebaseConfig = await configResponse.json()
        }
      } catch (error) {
        console.log('Firebase config file not found, using environment variables')
      }

      // If no config file, use environment variables
      if (!firebaseConfig) {
        firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }
      }

      // Validate that we have the required API key
      if (!firebaseConfig.apiKey) {
        throw new Error('Firebase API key is required. Please set NEXT_PUBLIC_FIREBASE_API_KEY in your environment variables or update firebase-config.json.')
      }

      // Load service account for additional info
      try {
        const serviceAccountResponse = await fetch('/firebase-service-account.json')
        if (serviceAccountResponse.ok) {
          const serviceAccount: FirebaseServiceAccount = await serviceAccountResponse.json()
          firebaseConfig.serviceAccount = serviceAccount
        }
      } catch (error) {
        console.log('Service account file not found, continuing without it')
      }

      this.firebaseConfig = firebaseConfig
      return this.firebaseConfig
    } catch (error) {
      console.error('Failed to load Firebase config:', error)
      throw new Error('Firebase configuration not found. Please check your environment variables or firebase-config.json file.')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Auth request failed:', error)
      throw error
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const { name, ...data } = userData
    data.firstName = name.split(' ')[0]
    data.lastName = name.split(' ')[1]
    return await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async googleAuth(token: string): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    })
  }

  async logout(): Promise<void> {
    const token = this.getToken()
    if (token) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    this.clearTokens()
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    return await this.request<AuthResponse['user']>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  async updateUserRole(userId: string, role: string): Promise<AuthResponse['user']> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    return await this.request<AuthResponse['user']>(`/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
  }

  // Token management
  setTokens(token: string, refreshToken?: string): void {
    localStorage.setItem('auth_token', token)
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  clearTokens(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Firebase Google OAuth helpers
  async initializeFirebaseAuth(): Promise<void> {
    // Load Firebase SDK
    return new Promise((resolve) => {
      if (window.firebase) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        const authScript = document.createElement('script')
        authScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js'
        authScript.async = true
        authScript.defer = true
        authScript.onload = () => resolve()
        document.head.appendChild(authScript)
      }
      document.head.appendChild(script)
    })
  }

  async signInWithFirebaseGoogle(): Promise<AuthResponse> {
    try {
      await this.initializeFirebaseAuth()

      if (!window.firebase) {
        throw new Error('Firebase SDK failed to load. Please check your internet connection.')
      }

      const firebaseConfig = await this.loadFirebaseConfig()
      
      // Initialize Firebase app if not already initialized
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig)
      }

      const provider = new window.firebase.auth.GoogleAuthProvider()
      
      // Add additional scopes if needed
      provider.addScope('email')
      provider.addScope('profile')
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      return new Promise((resolve, reject) => {
        window.firebase.auth().signInWithPopup(provider)
          .then(async (result: any) => {
            try {
              // Get the ID token from Firebase
              const idToken = await result.user.getIdToken()
              
              // Send the ID token to your backend
              const authResponse = await this.googleAuth(idToken)
              resolve(authResponse)
            } catch (error) {
              console.error('Error getting ID token:', error)
              reject(new Error('Failed to get authentication token. Please try again.'))
            }
          })
          .catch((error: any) => {
            console.error('Firebase auth error:', error)
            
            // Handle specific Firebase errors
            let errorMessage = 'Google sign-in failed. Please try again.'
            
            switch (error.code) {
              case 'auth/popup-closed-by-user':
                errorMessage = 'Sign-in was cancelled. Please try again.'
                break
              case 'auth/popup-blocked':
                errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site and try again.'
                break
              case 'auth/unauthorized-domain':
                errorMessage = 'This domain is not authorized for Google sign-in.'
                break
              case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.'
                break
              default:
                errorMessage = error.message || 'Google sign-in failed. Please try again.'
            }
            
            reject(new Error(errorMessage))
          })
      })
    } catch (error) {
      console.error('Firebase initialization error:', error)
      throw error
    }
  }

  // Alternative method using Google OAuth directly
  async signInWithGoogle(): Promise<AuthResponse> {
    await this.initializeGoogleAuth()

    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google OAuth not loaded'))
        return
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'email profile openid',
        callback: async (response: GoogleOAuthResponse) => {
          try {
            if (response.error) {
              reject(new Error(response.error))
              return
            }

            // Send the access token to your backend
            const authResponse = await this.googleAuth(response.access_token)
            resolve(authResponse)
          } catch (error) {
            reject(error)
          }
        },
      })

      client.requestAccessToken()
    })
  }

  // Google OAuth helpers (fallback)
  async initializeGoogleAuth(): Promise<void> {
    // Load Google OAuth script
    return new Promise((resolve) => {
      if (window.google) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }

  // Method to get Google access token and send to backend
  async getGoogleAccessToken(): Promise<string> {
    await this.initializeGoogleAuth()

    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google OAuth not loaded'))
        return
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'email profile openid',
        callback: (response: GoogleOAuthResponse) => {
          if (response.error) {
            reject(new Error(response.error))
            return
          }
          resolve(response.access_token)
        },
      })

      client.requestAccessToken()
    })
  }
}

export const authService = new AuthService()

// Type declarations for Google OAuth and Firebase
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void
          }
        }
      }
    }
    firebase: any
  }
}

interface GoogleOAuthResponse {
  access_token: string
  error?: string
} 