# Backend Integration for SignAware

This document describes the backend integration setup for the SignAware application.

## Overview

The application now supports both file upload and text paste functionality with backend integration. The backend can be either:
1. **Next.js API Routes** (default) - Built-in API routes for development and testing
2. **External Backend** - Connect to a separate backend service

## Environment Configuration

### For Next.js API Routes (Default)
```bash
# File upload configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,txt
```

### For External Backend
```bash
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# File upload configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,txt
```

## API Endpoints

### File Upload
- **Endpoint**: `POST /api/upload`
- **Purpose**: Upload document files
- **Supported formats**: PDF, DOC, DOCX, TXT
- **Max file size**: 10MB
- **Response**: `{ fileId, fileName, fileSize, message }`

### Document Analysis
- **Endpoint**: `POST /api/analyze`
- **Purpose**: Analyze uploaded files or text
- **Request body**:
  ```json
  {
    "fileId": "string", // for file analysis
    "text": "string",   // for text analysis
    "type": "file" | "text"
  }
  ```
- **Response**:
  ```json
  {
    "id": "analysis_id",
    "status": "completed" | "processing" | "failed",
    "analysis": {
      "riskLevel": "low" | "medium" | "high",
      "summary": "string",
      "keyFindings": ["string"],
      "recommendations": ["string"],
      "complianceIssues": ["string"]
    }
  }
  ```

### Health Check
- **Endpoint**: `GET /api/health`
- **Purpose**: Check API status
- **Response**: `{ status, timestamp, service, version }`

## File Structure

```
├── lib/
│   └── api.ts              # API service layer
├── hooks/
│   └── useAnalysis.ts      # Custom hook for analysis
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts    # File upload handler
│   │   ├── analyze/
│   │   │   └── route.ts    # Analysis handler
│   │   └── health/
│   │       └── route.ts    # Health check handler
│   └── analyze/
│       └── page.tsx        # Updated analyze page
└── uploads/                # File storage directory (created automatically)
```

## Features

### File Upload
- Drag and drop support
- File type validation
- File size validation
- Upload progress tracking
- Error handling

### Text Analysis
- Direct text input
- Real-time validation
- Error handling

### Error Handling
- Network errors
- File validation errors
- Server errors
- User-friendly error messages

### Progress Tracking
- Upload progress for files
- Analysis status updates
- Loading states

## Usage

1. **File Upload**:
   - Drag and drop a file or click to browse
   - Supported formats: PDF, DOC, DOCX, TXT
   - Maximum size: 10MB
   - Progress bar shows upload status

2. **Text Analysis**:
   - Paste text directly into the textarea
   - No file size limits
   - Immediate processing

3. **Analysis Results**:
   - Risk level assessment
   - Key findings
   - Recommendations
   - Compliance issues

## Development

### Running with Next.js API Routes
```bash
npm run dev
```
The application will use built-in API routes for testing.

### Connecting to External Backend
1. Set the environment variables for your backend
2. Ensure your backend implements the required endpoints
3. Update the API service configuration if needed

### Testing
- Upload different file types
- Test with various text lengths
- Verify error handling
- Check progress tracking

## Security Considerations

- File type validation
- File size limits
- Secure file storage
- Input sanitization
- Error message sanitization

## Future Enhancements

- Authentication integration
- File encryption
- Advanced analysis features
- Real-time collaboration
- Export functionality 