import { NextRequest, NextResponse } from 'next/server'
import { openai, generateEmbedding, searchSimilarDocuments } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate embedding for the user's message
    const queryEmbedding = await generateEmbedding(message)

    // Search for relevant documents in Supabase
    const relevantDocs = await searchSimilarDocuments(queryEmbedding, 0.7, 5)

    // Build context from relevant documents
    const context = relevantDocs
      .map((doc: any) => doc.content)
      .join('\n\n')

    // Build the system message with context
    const systemMessage = context
      ? `You are a helpful AI assistant for Visma. Use the following context to answer the user's question. If the context doesn't contain relevant information, you can use your general knowledge but mention that the information might not be from the company's knowledge base.

Context:
${context}

Answer the user's question based on the context above. Be concise, helpful, and accurate.`
      : `You are a helpful AI assistant for Visma. Answer the user's questions to the best of your ability. If you don't have specific information from the knowledge base, provide general helpful information and mention that.`

    // Build messages array for OpenAI
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory,
      { role: 'user', content: message },
    ]

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const assistantMessage = completion.choices[0].message.content

    return NextResponse.json({
      message: assistantMessage,
      sources: relevantDocs.length > 0 ? relevantDocs.length : 0,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
