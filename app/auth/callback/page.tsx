'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        router.push('/auth/signin?error=client_error');
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          router.push('/auth/signin?error=callback_error');
          return;
        }

        if (!session) {
          router.push('/auth/signin');
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile check error:', profileError);
          router.push('/auth/signin?error=profile_error');
          return;
        }

        // Create profile if it doesn't exist
        if (!profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              full_name: session.user.user_metadata.full_name || session.user.email,
              username: session.user.email?.split('@')[0] || 'user',
            });

          if (insertError) {
            console.error('Profile creation error:', insertError);
            router.push('/auth/signin?error=profile_creation_error');
            return;
          }
        }

        router.push('/dashboard');
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        router.push('/auth/signin?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}