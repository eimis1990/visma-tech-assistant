import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

const ALLOWED_EMAIL_DOMAINS = ['visma.com']

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
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
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
