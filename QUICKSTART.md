# Quick Start Guide

Get your Visma Tech Assistant up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
```

### Getting Your Credentials

**Supabase:**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Project Settings > API
3. Copy the URL and anon key

**OpenAI:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys
3. Create a new key

## Step 3: Set Up Database

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Click "Run"

This creates the necessary tables and functions for RAG.

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Add Your First Document

Use the API to add documents to your knowledge base:

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Visma provides cloud-based business software solutions for accounting, HR, and payroll.",
    "metadata": {"category": "company-info", "title": "About Visma"}
  }'
```

## Step 6: Start Chatting!

Type a question like:
- "What does Visma do?"
- "Tell me about the company"
- Or use voice input by clicking the microphone icon 🎤

## Troubleshooting

**Q: Voice input doesn't work**
- Make sure you're using Chrome or Edge browser
- Allow microphone permissions when prompted

**Q: Getting API errors**
- Double-check your `.env.local` file
- Make sure all environment variables are set
- Verify your OpenAI API key has credits

**Q: No search results**
- Add documents to your knowledge base first
- Documents need embeddings to be searchable

**Q: Database errors**
- Make sure you ran the `database-setup.sql` script
- Verify pgvector extension is enabled in Supabase

## Next Steps

- Add more documents to your knowledge base
- Customize the UI in `app/components/`
- Adjust the AI model in `app/api/chat/route.ts`
- Deploy to production (see README.md)

## Need Help?

Check the full [README.md](./README.md) for detailed documentation.
