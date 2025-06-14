import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { style, description } = await req.json();

    if (!style) {
      return NextResponse.json({ error: 'Avatar style is required' }, { status: 400 });
    }

    // Mock HeyGen API integration
    // In production, replace with actual HeyGen API calls
    const mockAvatar = {
      id: `avatar_${Date.now()}`,
      style,
      description,
      thumbnail_url: `https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=400`,
      heygen_avatar_id: `heygen_${Date.now()}`,
      status: 'ready'
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({ avatar: mockAvatar });
  } catch (error: any) {
    console.error('Avatar creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create avatar' },
      { status: 500 }
    );
  }
}