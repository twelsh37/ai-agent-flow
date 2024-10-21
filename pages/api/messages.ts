import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../server/db';
import { messages } from '../../server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * API handler for managing messages.
 * 
 * This handler supports the following operations:
 * - GET: Fetch messages for a specific session
 * - POST: Create a new message for a session
 * 
 * @param {NextApiRequest} req - The incoming HTTP request object
 * @param {NextApiResponse} res - The HTTP response object to send back
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch messages for a session
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing sessionId' });
    }

    try {
      const sessionMessages = await db.select().from(messages).where(eq(messages.sessionId, sessionId));
      res.status(200).json(sessionMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  } else if (req.method === 'POST') {
    // Create a new message
    const { sessionId, content, role } = req.body;

    if (!sessionId || !content || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const newMessage = await db.insert(messages).values({
        sessionId,
        content,
        role,
      }).returning();
      res.status(201).json(newMessage[0]);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
