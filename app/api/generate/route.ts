import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { openaiKey, prompt } = await request.json();

    if (!openaiKey || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a YouTube video metadata expert. Generate compelling titles, descriptions, and tags for videos. Return your response as a JSON object with fields: title, description, and tags (array of strings).',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error('No content generated');
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // If not valid JSON, create structured response
      result = {
        title: content.substring(0, 100),
        description: content,
        tags: ['AI Generated', 'Video'],
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
