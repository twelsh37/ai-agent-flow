import React from 'react'
import AgentConfig from './AgentConfig'
import Chat from './Chat'

/**
 * AgentFlow Component
 * 
 * This component represents the main layout for the AI Agent Flow interface.
 * It combines the AgentConfig and Chat components to create a complete
 * agent interaction experience.
 *
 * @returns {JSX.Element} The rendered AgentFlow component
 */
const AgentFlow: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Main title for the AI Agent Flow interface */}
      <h1 className="text-2xl font-bold mb-4">AI Agent Flow</h1>
      
      {/* AgentConfig component for configuring the AI agent */}
      <AgentConfig />
      
      {/* Chat component for interacting with the AI agent */}
      <Chat />
    </div>
  )
}

export default AgentFlow
