'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/signin?error=callback_error');
        return;
      }

      if (data.session) {
        // Check if profile exists, create if not
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.session.user.id)
          .single();

        if (!profile) {
          await supabase
            .from('profiles')
            .insert({
              id: data.session.user.id,
              full_name: data.session.user.user_metadata.full_name || data.session.user.email,
              username: data.session.user.email?.split('@')[0] || 'user',
            });
        }

        router.push('/dashboard');
      } else {
        router.push('/auth/signin');
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