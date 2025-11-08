import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/openai'

// Get all documents
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ documents: data })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// Add a new document
export async function POST(req: NextRequest) {
  try {
    const { content, metadata = {} } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Generate embedding for the document
    const embedding = await generateEmbedding(content)

    // Insert document into Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          content,
          metadata,
          embedding,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ document: data[0] })
  } catch (error) {
    console.error('Error adding document:', error)
    return NextResponse.json(
      { error: 'Failed to add document' },
      { status: 500 }
    )
  }
}
