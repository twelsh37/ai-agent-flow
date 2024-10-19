import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, modelFamily, model, sessionId, history } = await req.json();

    let response: string;

    // Use the full history for context
    const messages = [...history, { role: 'user', content: message }];

    if (modelFamily === 'OpenAI Models') {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
      });
      response = completion.choices[0].message.content || 'No response generated.';
    } else if (modelFamily === 'Anthropic Models') {
      const anthropicMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      const completion = await anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        messages: anthropicMessages,
      });
      response = completion.content[0].text;
    } else {
      throw new Error('Unsupported model family');
    }

    return NextResponse.json({ response, sessionId });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}