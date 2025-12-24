import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

const ALLOWED_EMAIL_DOMAINS = ['visma.com']

/**
 * Get the base URL for redirects
 */
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_APP_URL ?? // First try our custom env var
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Then try Vercel's automatic env var
    'http://localhost:3000' // Finally fallback to localhost
  
  // Make sure to include https:// when not on localhost
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to remove trailing slash
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
  return url
}

/**
 * Check if a user has a Visma email domain
 * This is used to restrict access to certain features
 */
export function isVismaEmployee(user: User | null): boolean {
  if (!user?.email) return false
  const emailDomain = user.email.split('@')[1]?.toLowerCase()
  return ALLOWED_EMAIL_DOMAINS.includes(emailDomain)
}

/**
 * Sign in with Google OAuth
 * Redirects to Google for authentication
 * User will be redirected back to the app after successful authentication
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}/auth/callback`,
      scopes: 'https://www.googleapis.com/auth/gmail.send',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(email: string, password: string, username?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: username,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

/**
 * Get the current user session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return session
}

/**
 * Get the current user
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}
