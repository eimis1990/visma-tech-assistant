# Client Tool Implementation Guide - Document Opener

This guide explains how to create a client tool in 11Labs that allows the AI agent to open company documents in your application by triggering a dialog popup with a title and a button linking to the document URL.

## Overview

**Client tools** enable AI agents to execute functions directly on the user's client side (in your app). Instead of the agent just saying "here's the link", the agent can trigger a UI action like showing a modal dialog.

For our use case: When a user asks for a document, the agent will trigger a client tool that sends document information to your app, which then displays a modal with:
- Document title
- A button to open the Google Doc URL

---

## Part 1: Configure the Client Tool in 11Labs

### Step 1: Create a New Client Tool

In your 11Labs agent dashboard:

1. Navigate to **Tools** section
2. Click **"Add client tool"**
3. You'll see the tool configuration screen

### Step 2: Basic Configuration

Fill in the following fields:

#### Tool Name
```
open_document
```
- Use lowercase, underscores for spaces
- **IMPORTANT**: This name must match exactly in your app code (case-sensitive)

#### Tool Description
```
Use this tool to open a company document for the user. This will display a popup in the user's application with the document title and a button to open the document. Use this whenever the user asks for a specific document from the available documents library.
```

**Why this matters:** The description tells the AI agent when and how to use this tool. Be specific about the behavior.

#### Wait for Response
- ☑️ **Enable** "Wait for response"
- This makes the agent wait for confirmation before continuing the conversation

#### Disable Interruptions
- ☐ Leave unchecked (user should be able to interrupt)

#### Pre-tool Speech
- Set to **"Auto"**
- Agent will decide if it needs to say something before triggering the tool

#### Execution Mode
- Set to **"Immediate"**
- Tool triggers right away without agent speech delay

---

## Part 2: Define Tool Parameters

You need to define what information gets sent to your app. Click **"Add param"** for each parameter below:

### Parameter 1: Document Title

| Field | Value |
|-------|-------|
| **Data Type** | String |
| **Identifier** | `document_title` |
| **Required** | ☑️ Yes (checked) |
| **Value Type** | LLM Prompt |
| **Description** | The display name of the document (e.g., "Cancel Vacation", "Expense Compensations", "Parental Leave 1 Month", "Termination"). This will be shown as the title in the popup modal. |

### Parameter 2: Document URL

| Field | Value |
|-------|-------|
| **Data Type** | String |
| **Identifier** | `document_url` |
| **Required** | ☑️ Yes (checked) |
| **Value Type** | LLM Prompt |
| **Description** | The full Google Docs URL to the document (e.g., "https://docs.google.com/document/d/1JBThyche5tRNDf8WTGUoHV8APcZ20m4g/edit"). This will be used as the link target when the user clicks the "Open Document" button. |

**Why LLM Prompt?**
The LLM Prompt value type tells the AI to extract these values dynamically from the conversation context and the documents agent's knowledge base.

---

## Part 3: Save and Test Configuration

1. Click **"Save"** or **"Create tool"**
2. The tool is now available to your agent

---

## Part 4: Update Documents Agent to Use the Tool

Add this section to your **Documents Agent conversation goal**:

```markdown
## Using the Document Opener Tool

When providing a document to a user, you have access to the `open_document` client tool. Use this tool to trigger a popup in the user's application.

**When to use it:**
- Anytime a user asks for one of the available documents
- After identifying which specific document they need

**How to use it:**
1. Confirm which document they need
2. Trigger the `open_document` tool with:
   - `document_title`: The exact document name (e.g., "Cancel Vacation")
   - `document_url`: The full Google Docs URL

**Example:**
User: "I need the expense form"
You: "I'll open the Expense Compensations form for you."
[Trigger tool with: document_title="Expense Compensations", document_url="https://docs.google.com/document/d/1JRAz0Mrv1HglOJxsu5a6FoEsJ0aRYMhf/edit"]

After the tool executes, you can say something like: "The document should now be open in a popup. Let me know if you need anything else!"
```

---

## Part 5: Implement Tool Handler in Your App

Now you need to handle the `open_document` tool event in your application code.

### Event Structure

When the agent triggers the tool, your app will receive an event that looks like this:

```typescript
{
  type: "client_tool_call",
  tool_name: "open_document",
  parameters: {
    document_title: "Cancel Vacation",
    document_url: "https://docs.google.com/document/d/1JBThyche5tRNDf8WTGUoHV8APcZ20m4g/edit"
  },
  call_id: "unique-call-id-12345"
}
```

### Implementation Example (React/Next.js)

#### Step 1: Listen for Tool Events

In your component that manages the 11Labs agent:

```typescript
// app/page.tsx or wherever you have the elevenlabs-convai component

import { useState, useEffect } from 'react'
import DocumentModal from './components/DocumentModal'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')

  useEffect(() => {
    // Listen for client tool calls from ElevenLabs agent
    const handleToolCall = (event: CustomEvent) => {
      const { tool_name, parameters, call_id } = event.detail

      if (tool_name === 'open_document') {
        // Extract parameters
        setDocumentTitle(parameters.document_title)
        setDocumentUrl(parameters.document_url)
        setModalOpen(true)

        // Send success response back to agent
        const agentElement = document.querySelector('elevenlabs-convai')
        if (agentElement) {
          agentElement.dispatchEvent(
            new CustomEvent('client_tool_response', {
              detail: {
                call_id: call_id,
                success: true,
                result: `Opened document: ${parameters.document_title}`
              }
            })
          )
        }
      }
    }

    // Add event listener
    window.addEventListener('elevenlabs:client_tool_call', handleToolCall as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('elevenlabs:client_tool_call', handleToolCall as EventListener)
    }
  }, [])

  return (
    <div>
      {/* Your existing app UI */}
      <elevenlabs-convai agent-id="your-agent-id" />

      {/* Document Modal */}
      <DocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={documentTitle}
        documentUrl={documentUrl}
      />
    </div>
  )
}
```

#### Step 2: Create the Document Modal Component

```typescript
// components/DocumentModal.tsx

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  documentUrl: string
}

export default function DocumentModal({ isOpen, onClose, title, documentUrl }: DocumentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-600 mb-6">
          Click below to open the document in a new tab.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center font-medium"
          >
            Open Document
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Part 6: Complete Flow

Here's what happens when everything is set up:

1. **User asks for a document:**
   - "I need the expense form"

2. **Agent identifies the need:**
   - Documents Agent recognizes this as "Expense Compensations"

3. **Agent triggers the client tool:**
   - Tool name: `open_document`
   - Parameters:
     - `document_title`: "Expense Compensations"
     - `document_url`: "https://docs.google.com/document/d/1JRAz0Mrv1HglOJxsu5a6FoEsJ0aRYMhf/edit"

4. **Your app receives the event:**
   - Event listener catches `elevenlabs:client_tool_call`
   - Extracts `document_title` and `document_url`

5. **Modal displays:**
   - Shows title: "Expense Compensations"
   - Shows button: "Open Document" linking to the URL

6. **User clicks the button:**
   - Google Doc opens in new tab
   - User can close the modal

7. **App responds to agent:**
   - Sends success confirmation
   - Agent continues conversation: "The document should now be open. Let me know if you need anything else!"

---

## Troubleshooting

### Tool Not Triggering

**Check:**
- Is the tool name exactly `open_document` (case-sensitive)?
- Did you update the Documents Agent prompt to mention the tool?
- Is "Wait for response" enabled?

### Parameters Not Coming Through

**Check:**
- Are parameter identifiers exactly `document_title` and `document_url` (case-sensitive)?
- Did you set Value Type to "LLM Prompt"?
- Are descriptions clear enough for the AI to extract values?

### Modal Not Showing

**Check:**
- Is your event listener using the correct event name?
- Are you checking for the correct `tool_name` in the event handler?
- Is the modal component rendering based on state?

### Agent Not Waiting for Response

**Check:**
- "Wait for response" checkbox is enabled in tool config
- Your app is sending the `client_tool_response` event back
- The `call_id` in the response matches the `call_id` from the tool call

---

## Testing Checklist

- [ ] Tool created in 11Labs with correct name and description
- [ ] Two parameters configured: `document_title` and `document_url`
- [ ] Documents Agent prompt updated to use the tool
- [ ] Event listener implemented in your app
- [ ] Modal component created and styled
- [ ] Success response sent back to agent
- [ ] Test each document:
  - [ ] Cancel Vacation
  - [ ] Expense Compensations
  - [ ] Parental Leave 1 Month
  - [ ] Termination

---

## Next Steps

Once this is working, you can:
1. **Add more document types** - Just update the documents agent's knowledge base
2. **Enhance the modal** - Add document previews, download options, etc.
3. **Track analytics** - Log when documents are opened
4. **Add more client tools** - Create tools for other UI interactions (forms, navigation, etc.)

---

## Additional Resources

- [11Labs Client Tools Documentation](https://elevenlabs.io/docs/agents-platform/customization/tools/client-tools)
- [ElevenLabs Web Component Events](https://elevenlabs.io/docs/conversational-ai/docs/web)
- [React Custom Events Guide](https://react.dev/learn/responding-to-events)
