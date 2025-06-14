import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side Supabase client
export const createServerSupabaseClient = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are not configured');
    return null;
  }

  try {
    const cookieStore = await cookies();
    return createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}; 