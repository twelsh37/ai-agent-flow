import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

/**
 * OpenAI client instance
 * Initialized with the API key from environment variables
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Anthropic client instance
 * Initialized with the API key from environment variables
 */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST request handler for the chat API
 * 
 * This function processes incoming chat messages and generates responses
 * using either OpenAI or Anthropic models based on the specified model family.
 *
 * @param {Request} req - The incoming request object
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object
 */
export async function POST(req: Request) {
  try {
    // Extract relevant data from the request body
    const { message, modelFamily, model, sessionId, history } = await req.json();

    let response: string;

    // Prepare the full conversation history for context
    const messages = [...history, { role: 'user', content: message }];

    if (modelFamily === 'OpenAI Models') {
      // Generate response using OpenAI model
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
      });
      response = completion.choices[0].message.content || 'No response generated.';
    } else if (modelFamily === 'Anthropic Models') {
      // Convert message format for Anthropic API
      const anthropicMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Generate response using Anthropic model
      const completion = await anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        messages: anthropicMessages,
      });
      response = completion.content[0].text;
    } else {
      throw new Error('Unsupported model family');
    }

    // Return the generated response along with the session ID
    return NextResponse.json({ response, sessionId });
  } catch (error: any) {
    // Log the error and return an error response
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
