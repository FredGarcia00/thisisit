import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
    }

    // Reset monthly video count for all users
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ videos_created_this_month: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all users

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      message: 'Monthly usage reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Monthly usage reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset monthly usage' },
      { status: 500 }
    );
  }
}