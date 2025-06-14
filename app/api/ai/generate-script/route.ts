import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration, template } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are a professional script writer for short-form vertical videos (TikTok, Instagram Reels, YouTube Shorts). 

Create engaging, viral-worthy scripts that:
- Hook viewers in the first 3 seconds
- Are optimized for ${duration} seconds duration
- Match the ${template} template style
- Include natural speech patterns and pauses
- Have strong calls-to-action
- Are designed to maximize engagement

Format: Return only the script text that the AI avatar will speak. No stage directions or formatting - just the spoken content.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a ${duration}-second script for: ${prompt}` }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const script = completion.choices[0]?.message?.content;

    if (!script) {
      throw new Error('Failed to generate script');
    }

    return NextResponse.json({ script });
  } catch (error: any) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}