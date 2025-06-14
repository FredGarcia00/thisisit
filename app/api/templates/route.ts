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

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error('Error in templates GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}