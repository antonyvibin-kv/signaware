# External API Integration for SignAware

This document describes how to integrate SignAware with an external backend API.

## Overview

The application is now configured to work with an external backend API instead of local Next.js API routes. All authentication and document analysis requests are sent to your external backend.

## Environment Configuration

Update your `.env.local` file with your backend configuration:

```bash
# External Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Google OAuth Configuration (Firebase)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_firebase_web_client_id_here

# Firebase Configuration (Optional - for additional Firebase features)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# File upload configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,txt
```

## Firebase Google OAuth Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication in the Firebase console

### 2. Configure Google OAuth
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your authorized domains
4. Copy the **Web client ID** from the Google provider settings

### 3. Get Service Account Key
1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Add this JSON to your backend environment variables

### 4. Backend Configuration
Your backend needs to verify Google tokens using the Firebase Admin SDK:

```javascript
// Backend example (Node.js)
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// In your /auth/google endpoint
async function verifyGoogleToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Google token');
  }
}
```

## Required Backend API Endpoints

Your backend must implement the following endpoints:

### Authentication Endpoints

#### 1. POST `/api/v1/auth/login`
**Purpose**: User login with email and password

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "client"
  },
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### 2. POST `/api/v1/auth/signup`
**Purpose**: User registration

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "client"
}
```

**Response**: Same as login response

#### 3. POST `/api/v1/auth/google`
**Purpose**: Google OAuth authentication with Firebase

**Request Body**:
```json
{
  "token": "google_id_token_from_firebase"
}
```

**Backend Processing**:
1. Verify the ID token using Firebase Admin SDK
2. Extract user information from the verified token
3. Create or update user in your database
4. Generate JWT token for your application

**Response**: Same as login response

#### 4. POST `/api/v1/auth/refresh`
**Purpose**: Refresh JWT token

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response**: Same as login response

#### 5. POST `/api/v1/auth/logout`
**Purpose**: User logout

**Headers**: `Authorization: Bearer <token>`

**Response**: `{ "message": "Logged out successfully" }`

#### 6. GET `/api/v1/auth/me`
**Purpose**: Get current user information

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "client"
}
```

### Document Analysis Endpoints

#### 1. POST `/api/v1/upload`
**Purpose**: Upload document files

**Headers**: `Authorization: Bearer <token>`

**Request**: `FormData` with file

**Response**:
```json
{
  "fileId": "file_id_here",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "message": "File uploaded successfully"
}
```

#### 2. POST `/api/v1/analyze`
**Purpose**: Analyze documents (files or text)

**Headers**: `Authorization: Bearer <token>`

**Request Body** (for file analysis):
```json
{
  "fileId": "file_id_here",
  "type": "file"
}
```

**Request Body** (for text analysis):
```json
{
  "text": "Document text content...",
  "type": "text"
}
```

**Response**:
```json
{
  "id": "analysis_id",
  "status": "completed",
  "analysis": {
    "riskLevel": "medium",
    "summary": "Document analysis summary",
    "keyFindings": [
      "Finding 1",
      "Finding 2"
    ],
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ],
    "complianceIssues": [
      "Compliance issue 1",
      "Compliance issue 2"
    ]
  }
}
```

#### 3. GET `/api/v1/analyze/{analysisId}`
**Purpose**: Get analysis status and results

**Headers**: `Authorization: Bearer <token>`

**Response**: Same as analyze response

#### 4. GET `/api/v1/analyze/history`
**Purpose**: Get user's analysis history

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
[
  {
    "id": "analysis_id_1",
    "status": "completed",
    "analysis": { ... }
  },
  {
    "id": "analysis_id_2",
    "status": "processing",
    "analysis": null
  }
]
```

#### 5. GET `/api/v1/health`
**Purpose**: Health check endpoint

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "SignAware API",
  "version": "1.0.0"
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Authentication Flow

1. **Login/Signup**: User provides credentials
2. **Token Storage**: Frontend stores JWT token in localStorage
3. **API Requests**: All subsequent requests include `Authorization: Bearer <token>` header
4. **Token Refresh**: When token expires, use refresh token to get new token
5. **Logout**: Clear tokens and redirect to login

## Google OAuth Flow with Firebase

1. **Frontend**: Loads Google OAuth script
2. **User Action**: User clicks "Continue with Google"
3. **OAuth Flow**: Google handles authentication
4. **Token Exchange**: Frontend sends Google ID token to `/api/v1/auth/google`
5. **Backend**: Verifies token with Firebase Admin SDK and creates user session

## File Upload Flow

1. **File Validation**: Frontend validates file type and size
2. **Upload**: File sent to `/api/v1/upload` with auth header
3. **Analysis**: File ID sent to `/api/v1/analyze` for processing
4. **Status Check**: Poll `/api/v1/analyze/{id}` for completion
5. **Results**: Display analysis results to user

## Security Considerations

- Use HTTPS in production
- Implement proper JWT token validation
- Validate file uploads server-side
- Implement rate limiting
- Use secure session management
- Validate all input data
- Implement proper error handling
- Store Firebase service account securely
- Never expose service account keys in frontend

## Testing

Test your backend endpoints using tools like:
- Postman
- curl
- Insomnia

Example curl commands:

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Google OAuth (requires valid ID token)
curl -X POST http://localhost:8000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"google_id_token_here"}'

# Upload file
curl -X POST http://localhost:8000/api/v1/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf"

# Analyze document
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"fileId":"file_id","type":"file"}'
```

## Deployment

1. Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL
2. Configure Google OAuth client ID for your domain
3. Ensure CORS is properly configured on your backend
4. Set up proper SSL certificates
5. Configure environment variables for production
6. Store Firebase service account securely on your backend
7. Add your production domain to Firebase authorized domains 