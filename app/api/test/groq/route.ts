import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Try the requested model first, then fallback to working model
    const models = ['openai/gpt-oss-20b', 'llama-3.1-8b-instant'];
    let lastError: Error | null = null;
    let usedModel = '';
    
    for (const model of models) {
      try {
        const response = await groq.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful code review assistant. Provide brief, constructive feedback on code.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        const aiResponse = response.choices[0]?.message?.content;
        usedModel = model;
        
        return NextResponse.json({
          response: aiResponse || 'No response received',
          model: usedModel,
        });
        
      } catch (error) {
        console.log(`Model ${model} failed, trying next model...`);
        lastError = error as Error;
        continue;
      }
    }
    
    throw lastError || new Error('All models failed');

  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Groq' },
      { status: 500 }
    );
  }
}
