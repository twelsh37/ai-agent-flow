import React from 'react'
import AgentConfig from './AgentConfig'
import Chat from './Chat'

const AgentFlow: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Agent Flow</h1>
      <AgentConfig />
      <Chat />
    </div>
  )
}

export default AgentFlow
