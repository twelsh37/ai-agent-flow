import React, { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  role: string;
  content: string;
  model: string; // Add this line to include the model information
}

interface ConversationProps {
  messages: Message[];
}

const Conversation: React.FC<ConversationProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <div className="flex flex-col space-y-4 h-full">
      {messages.map((message, index) => (
        <div key={index} className="space-y-2">
          <div className={`font-bold ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            {message.role === 'user' ? (
              <>
                <span className="font-normal italic text-sm mr-2">{message.model} -</span>
                You
              </>
            ) : (
              <>
                JarvisAI
                <span className="font-normal italic text-sm ml-2">- {message.model}</span>
              </>
            )}
          </div>
          <div className={`p-4 rounded-lg ${
            message.role === 'user' 
              ? 'bg-blue-100 ml-auto' 
              : 'bg-green-100 border border-green-200'
          } max-w-[80%] overflow-auto`}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default Conversation