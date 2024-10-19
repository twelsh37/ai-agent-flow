import React, { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

/**
 * Interface representing a single message in the conversation
 */
interface Message {
  role: string;
  content: string;
  model: string;
}

/**
 * Props interface for the Conversation component
 */
interface ConversationProps {
  messages: Message[];
}

/**
 * Conversation Component
 * 
 * This component renders a list of messages in a chat-like interface.
 * It supports markdown rendering and code syntax highlighting.
 * 
 * @param {ConversationProps} props - The properties passed to the component
 * @returns {JSX.Element} The rendered Conversation component
 */
const Conversation: React.FC<ConversationProps> = ({ messages }) => {
  // Reference to the end of the message list for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * Scrolls the view to the bottom of the message list
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Effect to scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages])

  return (
    <div className="flex flex-col space-y-4 h-full">
      {messages.map((message, index) => (
        <div key={index} className="space-y-2">
          {/* Message header with role and model info */}
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
          {/* Message content with markdown rendering */}
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
      {/* Invisible div for scrolling reference */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default Conversation
