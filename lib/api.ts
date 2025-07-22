const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1'
const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760')
const ALLOWED_FILE_TYPES = process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'doc', 'docx', 'txt']

export interface AnalysisRequest {
  file?: File
  text?: string
}

export interface AnalysisResponse {
  id: string
  status: 'processing' | 'completed' | 'failed'
  analysis?: {
    riskLevel: 'low' | 'medium' | 'high'
    summary: string
    keyFindings: string[]
    recommendations: string[]
    complianceIssues: string[]
  }
  error?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface DashboardResponse {
  stats: {
    totalAnalyses: number
    avgRiskScore: number
    documentsThisMonth: number
    timesSaved: string
  }
  recentAnalyses: Array<{
    id: number
    title: string
    date: string
    riskScore: number
    status: string
    type: string
  }>
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${API_VERSION}`
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          }
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText)
            console.log('response', response)
            resolve(response.id)
          } catch (error) {
            reject(new Error('Invalid response format'))
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            reject(new Error(errorResponse.error || `Upload failed with status: ${xhr.status}`))
          } catch {
            reject(new Error(`Upload failed with status: ${xhr.status}`))
          }
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      // Add auth header to upload request
      const token = localStorage.getItem('auth_token')
      xhr.open('POST', `${this.baseUrl}/documents/upload`)
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(formData)
    })
  }

  async analyzeDocument(
    request: AnalysisRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<AnalysisResponse> {
    try {
      if (request.file) {
        // Validate file
        this.validateFile(request.file)
        
        // Upload file first
        const fileId = await this.uploadFile(request.file, onProgress)
        console.log('fileId', fileId)
        // Start analysis
        return await this.request<AnalysisResponse>(`/documents/${fileId}/analyze`, {
          method: 'POST',
          body: JSON.stringify({
            fileId,
            type: 'file'
          })
        })
      } else if (request.text) {
        console.log('request.text !!!', request.text)
        // Analyze text directly
        return await this.request<AnalysisResponse>('/analysis/analyze-text', {
          method: 'POST',
          body: JSON.stringify({
            content: request.text,
            analysisType: "legal"
          })
        })
      } else {
        throw new Error('Either file or text must be provided')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      throw error
    }
  }

  async getAnalysisStatus(analysisId: string): Promise<AnalysisResponse> {
    return await this.request<AnalysisResponse>(`/analyze/${analysisId}`)
  }

  async getAnalysisHistory(): Promise<AnalysisResponse[]> {
    return await this.request<AnalysisResponse[]>('/analyze/history')
  }

  private validateFile(file: File): void {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !ALLOWED_FILE_TYPES.includes(fileExtension)) {
      throw new Error(`File type not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`)
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return await this.request<{ status: string; timestamp: string }>('/health')
  }

  // Dashboard method
  async getDashboard(): Promise<DashboardResponse> {
    return await this.request<DashboardResponse>('/dashboard')
  }
}

export const apiService = new ApiService() 