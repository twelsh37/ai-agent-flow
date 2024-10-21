import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../server/db';
import { sessions, messages } from '../../server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create a new session
    const { userId, name } = req.body;
    const newSession = await db.insert(sessions).values({
      id: uuidv4(),
      userId,
      name,
    }).returning();
    res.status(201).json(newSession[0]);
  } else if (req.method === 'GET') {
    // Get all sessions for a user
    const { userId } = req.query;
    const userSessions = await db.select().from(sessions).where(eq(sessions.userId, userId as string));
    res.status(200).json(userSessions);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
