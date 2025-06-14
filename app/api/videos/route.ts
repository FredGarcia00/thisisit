import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Database } from '@/types/database';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database service is not available' },
        { status: 503 }
      );
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: videos, error } = await supabase
      .from('videos')
      .select(`
        *,
        templates(name, category),
        avatars(name, style)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error('Error in videos GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database service is not available' },
        { status: 503 }
      );
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const videoData = await req.json();

    // Check subscription limits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_plan, videos_created_this_month')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to verify subscription status' },
        { status: 500 }
      );
    }

    if (profile?.subscription_plan === 'free' && profile.videos_created_this_month >= 3) {
      return NextResponse.json(
        { error: 'Free plan limit reached. Upgrade to Pro for unlimited videos.' },
        { status: 403 }
      );
    }

    // Create video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert({
        ...videoData,
        user_id: session.user.id,
        status: 'draft'
      })
      .select()
      .single();

    if (videoError) {
      console.error('Error creating video:', videoError);
      return NextResponse.json(
        { error: 'Failed to create video' },
        { status: 500 }
      );
    }

    // Update user's video count
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        videos_created_this_month: (profile?.videos_created_this_month || 0) + 1
      })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Error updating video count:', updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ video });
  } catch (error: any) {
    console.error('Error in videos POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}