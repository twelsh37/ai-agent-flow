'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface ChatProps {
  setMessages: React.Dispatch<React.SetStateAction<Array<{ role: string; content: string; model: string }>>>;
}

interface Session {
  id: string;
  name: string;
  messages: Array<{ role: string; content: string; model: string }>;
}

const Chat: React.FC<ChatProps> = ({ setMessages }) => {
  const modelFamilies = {
    'OpenAI Models': ['gpt-4', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    'Anthropic Models': ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
  }

  const defaultModels = {
    'OpenAI Models': 'gpt-4',
    'Anthropic Models': 'claude-3-opus-20240229'
  }

  const [modelFamily, setModelFamily] = useState('OpenAI Models')
  const [model, setModel] = useState(defaultModels['OpenAI Models'])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isDeleteButtonActive, setIsDeleteButtonActive] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setModel(defaultModels[modelFamily as keyof typeof defaultModels])
  }, [modelFamily])

  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions')
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions)
      setSessions(parsedSessions)
      
      const lastSessionId = localStorage.getItem('lastActiveSessionId')
      if (lastSessionId) {
        setCurrentSessionId(lastSessionId)
        setIsDeleteButtonActive(true)
        const lastSession = parsedSessions.find((s: Session) => s.id === lastSessionId)
        if (lastSession) {
          setMessages(lastSession.messages)
        }
      }
    }
  }, [setMessages])

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('lastActiveSessionId', currentSessionId)
    }
  }, [currentSessionId])

  useEffect(() => {
    setIsDeleteButtonActive(!!currentSessionId)
  }, [currentSessionId])

  const startNewSession = () => {
    const newSession: Session = { 
      id: Date.now().toString(), 
      name: `Conversation ${sessions.length + 1}`,
      messages: [] 
    }
    setSessions(prev => [...prev, newSession])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setIsDeleteButtonActive(true)
  }

  const loadSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setMessages(session.messages)
    }
    setIsDeleteButtonActive(true)
  }

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
      setMessages([])
      setIsDeleteButtonActive(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    const userMessage = { role: 'user', content: input, model: model }
    
    let updatedSession: Session
    if (!currentSessionId) {
      updatedSession = { 
        id: Date.now().toString(), 
        name: `Conversation ${sessions.length + 1}`,
        messages: []
      }
      setSessions(prev => [...prev, updatedSession])
      setCurrentSessionId(updatedSession.id)
    } else {
      const existingSession = sessions.find(s => s.id === currentSessionId)
      if (!existingSession) {
        console.error('Session not found, creating a new one')
        updatedSession = { 
          id: Date.now().toString(), 
          name: `Conversation ${sessions.length + 1}`,
          messages: []
        }
        setSessions(prev => [...prev, updatedSession])
        setCurrentSessionId(updatedSession.id)
      } else {
        updatedSession = existingSession
      }
    }

    const updatedMessages = [...updatedSession.messages, userMessage]
    
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === updatedSession.id
          ? { ...session, messages: updatedMessages }
          : session
      )
    )
    setMessages(updatedMessages)
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input, 
          modelFamily, 
          model,
          sessionId: updatedSession.id,
          history: updatedMessages.map(({ role, content }) => ({ role, content }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.response, model: model }
      
      const newUpdatedMessages = [...updatedMessages, aiMessage]
      
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === updatedSession.id
            ? { ...session, messages: newUpdatedMessages }
            : session
        )
      )
      setMessages(newUpdatedMessages)
    } catch (error) {
      console.error('Error:', error)
      let errorMessage = 'Sorry, there was an error processing your request.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      const aiErrorMessage = { role: 'assistant', content: errorMessage, model: 'Error' }
      setMessages(prev => [...prev, aiErrorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 pb-2">
      <div>
        <label className="block mb-2 font-bold text-sm">Session</label>
        <select 
          value={currentSessionId || ''}
          onChange={(e) => loadSession(e.target.value)}
          className="w-full p-2 border rounded text-sm mb-2"
        >
          <option value="">Select a session</option>
          {sessions.map(session => (
            <option key={session.id} value={session.id}>{session.name}</option>
          ))}
        </select>
        <div className="flex space-x-2">
          <Button onClick={startNewSession} className="flex-1 text-sm">
            New Session
          </Button>
          <Button 
            onClick={() => isDeleteButtonActive && currentSessionId && deleteSession(currentSessionId)} 
            className={`flex-1 text-sm ${isDeleteButtonActive ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!isDeleteButtonActive}
          >
            Delete Session
          </Button>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-bold text-sm">Model Family</label>
        <select 
          value={modelFamily} 
          onChange={(e) => setModelFamily(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          {Object.keys(modelFamilies).map(family => (
            <option key={family} value={family}>{family}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block mb-2 font-bold text-sm">Model</label>
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          {modelFamilies[modelFamily as keyof typeof modelFamilies].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded resize-none text-sm"
          placeholder="Type your message..."
          rows={4}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-sm">
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}

export default Chat