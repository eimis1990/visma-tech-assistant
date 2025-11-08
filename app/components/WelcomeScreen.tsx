'use client'

import { MessageSquare, Database, Zap, Shield } from 'lucide-react'

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold gradient-text">
            Welcome to Visma Tech Assistant
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your intelligent AI assistant powered by advanced RAG technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Natural Conversations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat naturally with the AI using text or voice input
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Knowledge Base
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access information from your Supabase database instantly
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Fast Responses
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get accurate answers powered by RAG technology
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Secure & Private
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data stays safe with enterprise-grade security
            </p>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-gray-500 dark:text-gray-400">
            Start by asking a question or use voice input to begin
          </p>
        </div>
      </div>
    </div>
  )
}
