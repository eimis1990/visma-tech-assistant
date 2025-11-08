import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })

  return response.data[0].embedding
}

// Search for similar documents in Supabase
export async function searchSimilarDocuments(
  embedding: number[],
  matchThreshold: number = 0.7,
  matchCount: number = 5
) {
  const { supabase } = await import('./supabase')

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  })

  if (error) {
    console.error('Error searching documents:', error)
    return []
  }

  return data
}
