# Google Authentication Setup Guide

This guide will help you configure Google OAuth authentication with Supabase for the Visma Tech Assistant.

## Prerequisites

- Supabase project already set up
- Google Cloud Console account

## IMPORTANT: Showing Your App Name Instead of Supabase URL

If the Google sign-in screen shows the Supabase URL (e.g., `bbxapthswbodudfvbotu.supabase.co`) instead of your app name, you need to:

1. **Configure the OAuth Consent Screen properly** (Step 1, item 5 below)
2. **Add "supabase.co" to Authorized Domains** in the consent screen
3. **Set your App Name** in the consent screen settings
4. **Wait a few minutes** for Google's changes to propagate
5. **Clear your browser cache** or test in incognito mode

The **OAuth Consent Screen** configuration is what controls the display name users see!

## Step 1: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/

2. **Create a new project or select existing one**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing project

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as application type
   - Give it a name (e.g., "Visma Tech Assistant")

5. **Configure OAuth consent screen** (IMPORTANT - This controls what users see!)
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required information:
     - **App name**: "Visma Tech Assistant" (This is what users will see instead of the Supabase URL!)
     - **App logo**: Upload your logo (120x120px minimum, optional but recommended)
     - **Application home page**: `http://localhost:3000` (for development) or your production URL
     - **User support email**: your email
     - **Developer contact information**: your email
   - **Add Authorized Domains** (REQUIRED to show your app name):
     - Add `supabase.co` (required for OAuth callback)
     - Add `localhost` (for local development)
     - Add your production domain (e.g., `yourdomain.com`) if deploying
   - Click "Save and Continue"
   - **Add Scopes**:
     - Click "Add or Remove Scopes"
     - Select: `userinfo.email` and `userinfo.profile`
     - Save and continue
   - **Add Test Users** (if app is not verified):
     - Add email addresses of users who can test
     - Save and continue

6. **Add Authorized Redirect URIs**
   - In your OAuth client configuration, add the following redirect URI:
   ```
   https://bbxapthswbodudfvbotu.supabase.co/auth/v1/callback
   ```
   - Replace `bbxapthswbodudfvbotu` with your actual Supabase project reference ID
   - Click "Save"

7. **Copy your credentials**
   - Copy the "Client ID"
   - Copy the "Client Secret"
   - You'll need these for Supabase configuration

## Step 2: Configure Supabase

1. **Go to your Supabase Dashboard**
   - Visit https://app.supabase.com/

2. **Navigate to Authentication settings**
   - Go to "Authentication" > "Providers"
   - Find "Google" in the list

3. **Enable Google Provider**
   - Toggle "Enable Sign in with Google"
   - Paste your Google Client ID
   - Paste your Google Client Secret
   - Click "Save"

## Step 3: Update Environment Variables (Already Done)

Your `.env.local` file already contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://bbxapthswbodudfvbotu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_APP_URL` to your production domain.

## Step 4: Test the Integration

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Open the application**
   - Visit http://localhost:3000
   - Click the "Sign In" button in the header
   - The Google Sign-In modal should appear

3. **Click "Continue with Google"**
   - You'll be redirected to Google's OAuth consent screen
   - Sign in with your Google account
   - Grant permissions
   - You'll be redirected back to your app

4. **Verify the authentication**
   - Check the Supabase Dashboard > Authentication > Users
   - Your Google account should appear in the users list

## How It Works

### Components Created

1. **Modal Component** ([components/ui/modal.tsx](components/ui/modal.tsx))
   - Reusable modal with animations
   - Backdrop with blur effect
   - Close on Escape key
   - Prevents body scroll when open

2. **GoogleSignInModal Component** ([components/GoogleSignInModal.tsx](components/GoogleSignInModal.tsx))
   - Beautiful modal with welcome message
   - Google sign-in button with official branding
   - Loading states and error handling
   - Animated entrance effects

3. **Auth Utilities** ([lib/auth.ts](lib/auth.ts))
   - `signInWithGoogle()` - Initiates Google OAuth flow
   - `signOut()` - Signs out the current user
   - `getSession()` - Retrieves current session
   - `getUser()` - Retrieves current user

4. **Auth Callback Route** ([app/auth/callback/route.ts](app/auth/callback/route.ts))
   - Handles OAuth callback from Google
   - Exchanges authorization code for session
   - Redirects back to home page

### Authentication Flow

1. User clicks "Sign In" button
2. Modal opens with Google sign-in option
3. User clicks "Continue with Google"
4. Redirected to Google OAuth consent screen
5. User grants permissions
6. Google redirects to `/auth/callback` with authorization code
7. Callback route exchanges code for session
8. User is redirected to home page (signed in)
9. Session is stored in Supabase (automatically handled)

### Usage in Your App

To check if a user is authenticated:

```typescript
import { getUser } from '@/lib/auth'

// In a server component
const user = await getUser()
if (user) {
  console.log('User is signed in:', user.email)
}
```

To sign out:

```typescript
import { signOut } from '@/lib/auth'

const handleSignOut = async () => {
  await signOut()
  // Redirect or refresh
}
```

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud Console exactly matches:
  `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
- No trailing slashes

### "Error 400: redirect_uri_mismatch"
- Check that you've saved the redirect URI in Google Cloud Console
- Wait a few minutes for changes to propagate

### Modal doesn't open
- Check browser console for errors
- Verify all imports are correct
- Make sure Framer Motion is installed

### Sign-in doesn't work
- Verify Google OAuth credentials in Supabase Dashboard
- Check that Google provider is enabled in Supabase
- Make sure environment variables are set correctly

## Production Deployment

When deploying to production:

1. **Update Google Cloud Console**
   - Add production redirect URI:
     ```
     https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     ```
   - Add your production domain to "Authorized JavaScript origins"

2. **Update Environment Variables**
   - Set `NEXT_PUBLIC_APP_URL` to your production domain
   - Example: `https://visma-tech-assistant.vercel.app`

3. **Update OAuth Consent Screen**
   - Add your production domain
   - Submit for verification if needed (for production apps)

## Security Notes

- The Google OAuth flow is handled entirely by Supabase (secure)
- No sensitive credentials are exposed to the client
- Sessions are stored securely in Supabase
- Always use HTTPS in production
- Consider adding rate limiting to prevent abuse
- Implement proper authorization checks in your API routes

## Next Steps

Consider implementing:
- User profile page
- Protected routes that require authentication
- Sign out functionality in the UI
- User avatar display
- Session management and refresh
- Role-based access control (RBAC)
