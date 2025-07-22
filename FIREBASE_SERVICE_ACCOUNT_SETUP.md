# Firebase Service Account Setup for SignAware

This guide explains how to set up Firebase authentication using a service account JSON file.

## Setup Instructions

### 1. Get Firebase Service Account JSON

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file
6. Rename it to `firebase-service-account.json`

### 2. Add Service Account JSON to Project

1. Place the `firebase-service-account.json` file in the `public/` directory of your project
2. The file will be accessible at `/firebase-service-account.json` when the app runs

### 3. Update Environment Variables

You only need minimal environment variables now:

```bash
# External Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://5e44c052f820.ngrok-free.app
NEXT_PUBLIC_API_VERSION=v1

# File upload configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,txt
```

### 4. Project Structure

Your project should look like this:

```
signaware-app/
├── public/
│   └── firebase-service-account.json  # Your service account file
├── lib/
│   └── auth.ts                        # Updated auth service
├── hooks/
│   └── useAuth.ts                     # Updated auth hook
└── .env.local                         # Minimal environment variables
```

## How It Works

### 1. Service Account Loading
- The auth service loads the service account JSON from `/firebase-service-account.json`
- Extracts configuration from the service account
- Initializes Firebase with the extracted config

### 2. Firebase Configuration
The service account JSON is used to create Firebase config:
```javascript
{
  apiKey: serviceAccount.client_id,
  authDomain: `${serviceAccount.project_id}.firebaseapp.com`,
  projectId: serviceAccount.project_id,
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
  messagingSenderId: serviceAccount.client_id,
  appId: serviceAccount.client_id,
  serviceAccount: serviceAccount
}
```

### 3. Authentication Flow
1. User clicks "Continue with Google"
2. Firebase loads configuration from service account
3. Google OAuth popup opens
4. User authenticates with Google
5. Firebase returns ID token
6. Frontend sends ID token to backend
7. Backend verifies token and returns JWT
8. Frontend stores JWT for API calls

## Security Considerations

### ⚠️ Important Security Notes

1. **Never commit the service account JSON to version control**
   - Add `public/firebase-service-account.json` to `.gitignore`
   - The service account contains sensitive credentials

2. **Use environment-specific service accounts**
   - Create separate service accounts for development and production
   - Use different Firebase projects for different environments

3. **Restrict service account permissions**
   - Only grant necessary permissions to the service account
   - Regularly rotate the service account key

### 4. Gitignore Update

Add this to your `.gitignore` file:

```gitignore
# Firebase Service Account
public/firebase-service-account.json
```

## Testing

1. Place your `firebase-service-account.json` in the `public/` directory
2. Start the development server: `npm run dev`
3. Go to the login/signup page
4. Click "Continue with Google"
5. Complete the OAuth flow
6. Verify you're redirected to the dashboard

## Troubleshooting

### Common Issues

1. **"Firebase configuration not found"**
   - Check if `firebase-service-account.json` exists in `public/` directory
   - Verify the JSON file is valid
   - Check browser console for network errors

2. **"Invalid client"**
   - Verify the service account is for the correct Firebase project
   - Check if Google OAuth is enabled in Firebase Console

3. **"Access denied"**
   - Add your domain to Firebase authorized domains
   - Verify the OAuth consent screen is configured

### Debug Steps

1. Check if the service account file is accessible:
   ```
   http://localhost:3000/firebase-service-account.json
   ```

2. Open browser developer tools
3. Check the Console for errors
4. Check the Network tab for failed requests
5. Verify the service account JSON structure

## Service Account JSON Structure

Your service account JSON should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"
}
```

## Benefits of This Approach

1. **No environment variables needed** for Firebase config
2. **Easier deployment** - just include the JSON file
3. **Better security** - service account is not in environment variables
4. **Simpler setup** - fewer configuration steps
5. **Version control friendly** - can exclude sensitive files from git 