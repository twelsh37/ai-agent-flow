import { pgTable, serial, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Sessions Table
 * Represents chat sessions in the application.
 */
export const sessions = pgTable('sessions', {
  // Unique identifier for each session
  id: uuid('id').defaultRandom().primaryKey(),
  // ID of the user who owns this session
  userId: text('user_id').notNull(),
  // Name of the session
  name: text('name').notNull(),
  // Timestamp when the session was created
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // Timestamp when the session was last updated
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  messages: many(messages),
}));



/**
 * Messages Table
 * Stores individual messages within chat sessions.
 */
export const messages = pgTable('messages', {
  // Unique identifier for each message
  id: uuid('id').defaultRandom().primaryKey(),
  // Foreign key referencing the session this message belongs to
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  // Role of the message sender (e.g., 'user', 'assistant')
  role: text('role').notNull(),
  // Content of the message
  content: text('content').notNull(),
  // Timestamp when the message was created
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),
}));


/**
 * Message Metadata Table
 * Stores additional metadata for messages if needed.
 */
export const messageMetadata = pgTable('message_metadata', {
  // Unique identifier for each metadata entry
  id: uuid('id').defaultRandom().primaryKey(),
  // Foreign key referencing the message this metadata belongs to
  messageId: uuid('message_id').references(() => messages.id).notNull(),
  // JSON field to store flexible metadata
  metadata: jsonb('metadata'),
});

// You can add more tables or columns as needed
