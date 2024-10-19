import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

/**
 * Inter font configuration
 * Loads the Inter font with the Latin subset for optimal performance
 * @constant {Object} inter - The configured Inter font object
 */
const inter = Inter({ subsets: ['latin'] })

/**
 * Metadata for the application
 * This will be used by Next.js for SEO and document head management
 * @constant {Metadata} metadata - The metadata object for the application
 */
export const metadata: Metadata = {
  title: 'AI Chat Client',
  description: 'An application for managing AI chat flows',
}

/**
 * RootLayout Component
 * 
 * This is the root layout component for the AI Agent Flow application.
 * It wraps all pages and provides a consistent structure and styling.
 * 
 * @param {Object} props - The properties passed to the component
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered RootLayout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
