'use client';

import { createClient } from '@supabase/supabase-js';
import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Custom error class for auth service errors
export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase client is available
function checkSupabaseClient() {
  if (!supabase) {
    throw new AuthServiceError('Supabase client is not initialized. Please check your environment variables.');
  }
  return supabase;
}

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new AuthServiceError(error.message);
    }

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await client
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          username: email.split('@')[0], // Default username from email
        });

      if (profileError) console.error('Profile creation error:', profileError);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred during sign up');
  }
}

export async function signIn(email: string, password: string) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthServiceError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred during sign in');
  }
}

export async function signOut() {
  try {
    const client = checkSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) {
      throw new AuthServiceError(error.message);
    }
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred during sign out');
  }
}

export async function signInWithGoogle() {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      throw new AuthServiceError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred during Google sign in');
  }
}

export async function getSession() {
  try {
    const client = checkSupabaseClient();
    const { data: { session }, error } = await client.auth.getSession();
    
    if (error) {
      throw new AuthServiceError(error.message);
    }

    return session;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred while getting session');
  }
}

export async function getUser() {
  try {
    const client = checkSupabaseClient();
    const { data: { user }, error } = await client.auth.getUser();
    
    if (error) {
      throw new AuthServiceError(error.message);
    }

    return user;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred while getting user');
  }
}

export async function getUserProfile(userId: string) {
  checkSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchProfile(userId: string) {
  try {
    const client = checkSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new AuthServiceError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }
    if (error instanceof SupabaseAuthError) {
      throw new AuthServiceError(error.message);
    }
    throw new AuthServiceError('An unexpected error occurred while fetching profile');
  }
}