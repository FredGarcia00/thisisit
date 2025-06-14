'use client';

import { supabase } from './supabase';
import { AuthError, User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

function checkSupabaseClient() {
  if (!supabase) {
    throw new AuthError('Authentication service is not available');
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  checkSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  // Create profile after successful signup
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: fullName,
        username: email.split('@')[0], // Default username from email
      });

    if (profileError) console.error('Profile creation error:', profileError);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  checkSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  checkSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  checkSupabaseClient();

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  checkSupabaseClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
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