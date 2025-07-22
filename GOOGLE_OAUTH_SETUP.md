# Firebase Google OAuth Setup for SignAware

This guide explains how to set up Firebase Google OAuth for the SignAware application.

## Frontend Setup

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication in the Firebase console
4. Go to **Authentication** > **Sign-in method**
5. Enable **Google** as a sign-in provider
6. Add your authorized domains
7. Go to **Project Settings** > **General**
8. Scroll down to **Your apps** section
9. Click **Add app** > **Web**
10. Copy the Firebase configuration

### 2. Update Environment Variables

Update your `.env.local` file:

```bash
# External Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://5e44c052f820.ngrok-free.app
NEXT_PUBLIC_API_VERSION=v1

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google OAuth Configuration (fallback)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# File upload configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,txt
```

Replace the Firebase configuration values with your actual Firebase project settings.

## How It Works

### 1. Firebase OAuth Flow
1. User clicks "Continue with Google"
2. Firebase Google OAuth popup opens
3. User authenticates with Google
4. Firebase handles the OAuth flow
5. Frontend gets Firebase ID token
6. Frontend sends ID token to backend
7. Backend verifies token and returns JWT
8. Frontend stores JWT for API calls

### 2. Backend Integration
Your backend should have an endpoint that:
- Receives the Firebase ID token
- Verifies the token with Firebase Admin SDK
- Creates/updates user in your database
- Returns a JWT token for your application

### 3. API Endpoint
The frontend expects this endpoint:

```
POST /api/v1/auth/google
Content-Type: application/json

{
  "token": "firebase_id_token_here"
}
```

Response:
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

## Backend Setup (Firebase Admin SDK)

Your backend needs to verify Firebase ID tokens:

```javascript
// Backend example (Node.js)
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// In your /auth/google endpoint
async function verifyFirebaseToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
}
```

## Testing

1. Set up your Firebase configuration in `.env.local`
2. Start the development server: `npm run dev`
3. Go to the login/signup page
4. Click "Continue with Google"
5. Complete the OAuth flow
6. Verify you're redirected to the dashboard

## Troubleshooting

### Common Issues

1. **"Firebase not loaded"**
   - Check your internet connection
   - Verify the Firebase SDK is loading

2. **"Invalid client"**
   - Check your Firebase configuration
   - Verify authorized domains in Firebase Console

3. **"Access denied"**
   - Check if your domain is in authorized domains
   - Verify the OAuth consent screen is configured

4. **Backend errors**
   - Check your backend logs
   - Verify the `/auth/google` endpoint is working
   - Test with curl or Postman

### Debug Steps

1. Open browser developer tools
2. Check the Console for errors
3. Check the Network tab for failed requests
4. Verify environment variables are loaded correctly
5. Check Firebase Console for authentication logs

## Security Notes

- Never expose your Firebase service account key in frontend code
- Use HTTPS in production
- Add your production domain to Firebase authorized domains
- Store Firebase service account securely on your backend
- Regularly rotate your Firebase service account key if needed 