'use client'

import { useState } from 'react'
import Chat from './components/Chat'
import Conversation from './components/Conversation'

// Main component for the home page
export default function Home() {
  // State to store chat messages
  // Each message is an object with 'role' and 'content' properties
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])

  return (
    // Main container for the entire page
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page title */}
        <h1 className="text-2xl font-bold mb-6 text-center">Multi-Family Chat Client</h1>
        
        {/* Grid layout for sidebar and main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 flex flex-col">
            <div className="relative flex-grow">
              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-transparent opacity-50 blur-xl"></div>
              {/* Chat component container */}
              <div className="relative bg-white shadow-md rounded-lg p-4 h-full overflow-y-auto">
                {/* Chat component for user input */}
                <Chat setMessages={setMessages} />
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="col-span-9 flex flex-col">
            {/* Conversation title */}
            <h2 className="text font-bold mt-4 mb-4">Conversation</h2>
            <div className="relative flex-grow">
              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-transparent opacity-50 blur-xl"></div>
              {/* Conversation component container */}
              <div className="relative bg-white shadow-md rounded-lg p-4 h-[calc(100vh-200px)] overflow-hidden">
                {/* Scrollable area for conversation messages */}
                <div className="h-full overflow-y-auto pr-4 mr-[-16px]">
                  {/* Conversation component to display messages */}
                  <Conversation messages={messages} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
