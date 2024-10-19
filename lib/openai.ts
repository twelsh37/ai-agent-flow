import OpenAI from 'openai';

/**
 * OpenAI client instance
 * 
 * This creates a new instance of the OpenAI client using the API key
 * stored in the environment variables. The client can be used to make
 * requests to OpenAI's API endpoints.
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Export the OpenAI client instance as the default export
 * This allows other parts of the application to import and use
 * the same OpenAI client instance.
 */
export default openai;
