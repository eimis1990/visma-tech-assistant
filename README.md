# Visma Tech Assistant - AI RAG Application

A modern, beautiful single-page AI assistant application powered by RAG (Retrieval-Augmented Generation) technology. Built with Next.js 14, TypeScript, Supabase, and OpenAI.

## ✨ Features

- 🎨 **Modern & Beautiful UI** - Clean, gradient-based design with smooth animations
- 💬 **Natural Conversations** - Chat with the AI using text or voice input
- 🎤 **Voice Input** - Speak your questions using browser speech recognition
- 🔍 **RAG Technology** - Retrieves relevant information from your Supabase knowledge base
- 📊 **Real-time Responses** - Fast, accurate answers powered by OpenAI GPT-4
- 🌓 **Dark Mode** - Automatic dark/light theme based on system preferences
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL with pgvector)
- **AI**: OpenAI GPT-4, text-embedding-3-small
- **UI Components**: Lucide React icons, React Markdown, Framer Motion

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd visma-tech-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your actual credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**

   Run the SQL script in your Supabase SQL editor:
   ```bash
   # See database-setup.sql file
   ```

   This will:
   - Enable the pgvector extension
   - Create the documents table
   - Create the match_documents function for similarity search
   - Set up proper indexes

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
visma-tech-assistant/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Chat API endpoint with RAG
│   │   └── documents/route.ts     # Document management API
│   ├── components/
│   │   ├── ChatHeader.tsx         # App header component
│   │   ├── ChatMessage.tsx        # Message display component
│   │   ├── ChatInput.tsx          # Input with voice support
│   │   └── WelcomeScreen.tsx      # Landing screen
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main app page
├── lib/
│   ├── supabase.ts                # Supabase client
│   ├── openai.ts                  # OpenAI utilities
│   └── types.ts                   # TypeScript types
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── database-setup.sql             # Supabase database schema
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🎯 Usage

### Chatting with the Assistant

1. Type your question in the input field at the bottom
2. Press Enter or click the send button
3. The assistant will search the knowledge base and provide an answer
4. Continue the conversation naturally

### Using Voice Input

1. Click the microphone button in the input area
2. Speak your question
3. The text will appear in the input field
4. Click send or the microphone again to stop listening

### Adding Documents to Knowledge Base

Use the API to add documents:

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your document content here",
    "metadata": {"title": "Document Title", "category": "Category"}
  }'
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable the pgvector extension
3. Run the database setup SQL script
4. Copy your project URL and API keys to `.env.local`

### OpenAI Setup

1. Sign up for OpenAI API access
2. Generate an API key
3. Add the key to `.env.local`

## 🎨 Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: #6366f1;        /* Primary color */
  --primary-dark: #4f46e5;   /* Darker shade */
  /* ... other colors */
}
```

### Modifying the AI Model

Edit `app/api/chat/route.ts` to change the OpenAI model:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview', // Change this
  // ...
})
```

## 📚 API Endpoints

### POST /api/chat

Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Your question here",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "message": "AI response",
  "sources": 3
}
```

### GET /api/documents

Retrieve all documents from the knowledge base.

### POST /api/documents

Add a new document to the knowledge base.

**Request:**
```json
{
  "content": "Document content",
  "metadata": {"key": "value"}
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🐛 Troubleshooting

### Voice input not working

Voice input requires HTTPS or localhost. Make sure you're using a supported browser (Chrome, Edge).

### API errors

Check that all environment variables are set correctly in `.env.local`.

### Database connection issues

Verify your Supabase credentials and ensure the database is set up correctly.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and OpenAI
