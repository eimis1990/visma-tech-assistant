# Open Document Tool - Testing Guide

## ✅ What Was Fixed

### The Problem
Your previous implementation used `window.clientTools` to register the `open_document` tool. This approach **does not work** with ElevenLabs ConvAI widget because the widget doesn't look for global `window.clientTools`.

### The Solution
Updated [app/components/ElevenLabsWidget.tsx](../app/components/ElevenLabsWidget.tsx) to use the **correct approach** from the UNEET project:

1. **Listen for `elevenlabs-convai:call` event** - This event fires when the agent is about to start a conversation
2. **Register client tools on `event.detail.config.clientTools`** - The widget looks for tools in this specific location
3. **Added Script component** - Properly loads the ElevenLabs widget embed script

This matches exactly how the working UNEET project implements client tools.

---

## 🧪 How to Test

### Step 1: Start Your Dev Server

```bash
npm run dev
```

### Step 2: Open Browser Console

1. Open your app at `http://localhost:3000`
2. Press F12 to open Developer Tools
3. Go to the **Console** tab

### Step 3: Verify Event Listeners Are Registered

When the page loads, you should see:
```
✅ ElevenLabs event listeners registered
```

### Step 4: Click the ElevenLabs Widget

When you click the widget to start a conversation, look for:
```
✅ ElevenLabs widget script loaded
🎯 elevenlabs-convai:call event received!
✅ Client tools registered: ['open_document']
```

**If you see these logs, the tool registration is working! ✅**

### Step 5: Test the Tool

Ask the agent something like:
- "I need the expense form"
- "Show me the termination document"
- "Open the parental leave policy"

### Step 6: Verify Tool Call

When the agent calls the tool, you should see:
```
📄 open_document tool called by agent! { document_title: "...", document_url: "..." }
📤 Returning to agent: Successfully opened "..." for you. The document is now displayed in a modal where you can read it or open it in a new tab.
```

And in your hook:
```
✅ Tool call received: { tool_name: "open_document", parameters: {...} }
✅ Document drawer opened with: [document title]
```

### Step 7: Verify UI

The DocumentDrawer modal should appear with:
- Document title with a file icon
- "Open Document" button (opens in new tab)
- "Close" button

---

## 🔍 Troubleshooting

### Issue: Don't see "elevenlabs-convai:call event received"

**Possible causes:**
1. Widget script failed to load
2. Agent ID is incorrect
3. Event listener registered after widget initialized

**Solution:**
- Check browser console for script loading errors
- Verify agent ID in [app/page.tsx](../app/page.tsx) matches your 11Labs dashboard
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+F5)

### Issue: See event but no client tools registered

**Check that:**
```javascript
if (event.detail && event.detail.config) {
  // This should be true
}
```

If this condition fails, the event structure might have changed. Check the console log of the full event object.

### Issue: Agent says "tool not defined on client"

This means the 11Labs dashboard configuration is incorrect. Verify in your 11Labs dashboard:

1. **Tool name is exactly:** `open_document` (case-sensitive, no spaces)
2. **Tool type is:** `Client Tool` (NOT Server Tool)
3. **Parameters are exactly:**
   - `document_title` (String, Required, LLM Prompt)
   - `document_url` (String, Required, LLM Prompt)
4. **Tool is enabled** for your Documents Agent
5. **Changes are saved/published** in 11Labs

### Issue: Tool calls but modal doesn't appear

**Check:**
1. Console logs show the custom event being dispatched
2. `useElevenLabsTools` hook is active in [app/page.tsx](../app/page.tsx)
3. DocumentDrawer component receives the data
4. No JavaScript errors in console

**Debug:**
```javascript
// In useElevenLabsTools.ts, add more logging:
const handleToolCall = (event: Event) => {
  console.log("🔔 Event listener triggered", event);
  const customEvent = event as CustomEvent<ClientToolCallEvent>;
  console.log("📦 Event detail:", customEvent.detail);
  // ... rest of handler
};
```

---

## 📋 Implementation Flow

Here's how the complete flow works:

```
1. User visits page
   ↓
2. ElevenLabsWidget mounts
   ↓
3. Script component loads widget embed code
   ↓
4. Event listeners registered for 'elevenlabs-convai:call'
   ↓
5. User clicks widget to start conversation
   ↓
6. Widget fires 'elevenlabs-convai:call' event
   ↓
7. Our handler catches event and registers client tools on event.detail.config.clientTools
   ↓
8. Agent conversation starts with tools available
   ↓
9. User asks for a document
   ↓
10. Agent calls open_document(document_title, document_url)
    ↓
11. Our tool handler:
    - Dispatches 'elevenlabs:client_tool_call' event
    - Returns success message to agent
    ↓
12. useElevenLabsTools hook catches custom event
    ↓
13. Hook updates state with document data
    ↓
14. DocumentDrawer component renders with the data
    ↓
15. User sees modal with "Open Document" button
```

---

## 🎯 Key Differences from UNEET Project

The UNEET project has **two different agent implementations**:

### 1. Widget Approach (Landing Page)
- Uses `elevenlabs-convai` widget
- Registers tools via `elevenlabs-convai:call` event
- **This is what we're using** ✅

### 2. Conversation SDK Approach (Yacht Detail Pages)
- Uses `@11labs/client` Conversation API
- Registers tools via `clientTools` parameter in `Conversation.startSession()`
- Different approach for embedded conversations

**We chose the Widget approach** because it matches your use case: a floating widget on the landing page.

---

## 🔐 11Labs Dashboard Configuration

Make sure your Documents Agent in 11Labs has this **exact** configuration:

### Client Tool: open_document

**Name:**
```
open_document
```

**Type:**
```
Client Tool
```
⚠️ NOT "Server Tool"

**Description:**
```
Opens a company document modal for the user with the document title and link. Use this when the user asks to see, view, or open a specific document.
```

**Parameters:**

#### Parameter 1: document_title
- **Data Type:** String
- **Identifier:** `document_title`
- **Required:** Yes
- **Value Type:** LLM Prompt
- **Description:** The title of the document to display

#### Parameter 2: document_url
- **Data Type:** String
- **Identifier:** `document_url`
- **Required:** Yes
- **Value Type:** LLM Prompt
- **Description:** The Google Docs URL from the knowledge base

**Wait for response:** Yes/Enabled

---

## 📚 Knowledge Base Setup

Your Documents Agent should have a knowledge base with your documents:

```markdown
# Company Documents

1. Cancel Vacation
   - Link: https://docs.google.com/document/d/1JBThyche5tRNDf8WTGUoHV8APcZ20m4g/edit

2. Expense Compensations
   - Link: https://docs.google.com/document/d/1JRAz0Mrv1HglOJxsu5a6FoEsJ0aRYMhf/edit

3. Parental Leave 1 Month
   - Link: https://docs.google.com/document/d/1Jn3f7FNivjvDyGfTTO9u9eKc3gZDxowz/edit

4. Termination
   - Link: https://docs.google.com/document/d/1Jkz4d9G5XM-gNOieTJk1AEzHIRSO8rxc/edit
```

The agent uses this knowledge base to find the correct URL when a user asks for a document.

---

## 🎨 About the DocumentDrawer

Your current implementation uses a custom Modal component with:
- ✅ Framer Motion animations
- ✅ Backdrop blur effect
- ✅ Escape key to close
- ✅ Click outside to close
- ✅ Smooth spring animations
- ✅ Beautiful gradient button with hover effects

### Smooth Drawer Alternative

You mentioned wanting to use `@kokonutui/smooth-drawer`. This is optional - your current implementation already looks great!

**If you want to upgrade to smooth-drawer:**

```bash
npx shadcn@latest add @kokonutui/smooth-drawer
```

Then update DocumentDrawer.tsx to use the smooth-drawer component instead of the custom Modal. The smooth-drawer provides a slide-in drawer from the bottom/side instead of a centered modal.

**Current approach (Modal):** ✅ Works great, centered modal
**Alternative (Smooth Drawer):** Slide-in drawer from bottom/side

Both are valid - choose based on your UX preference!

---

## ✅ Success Checklist

Test your implementation:

- [ ] Page loads without errors
- [ ] Console shows "✅ ElevenLabs event listeners registered"
- [ ] Widget appears in bottom right corner
- [ ] Clicking widget shows "🎯 elevenlabs-convai:call event received!"
- [ ] Console shows "✅ Client tools registered: ['open_document']"
- [ ] Ask agent for a document
- [ ] Console shows "📄 open_document tool called by agent!"
- [ ] Modal/drawer appears with document title
- [ ] "Open Document" button works and opens correct Google Doc
- [ ] Close button works
- [ ] Clicking backdrop closes modal
- [ ] Pressing Escape closes modal
- [ ] Agent doesn't read URLs aloud
- [ ] Agent confirms document was opened

If all boxes are checked: **🎉 Your implementation is working perfectly!**

---

## 🆘 Still Having Issues?

1. **Check the full UNEET implementation:**
   - [public/UNEET/src/components/ElevenLabsWidget.tsx](../public/UNEET/src/components/ElevenLabsWidget.tsx)

2. **Compare event listeners:**
   - Make sure your event names match exactly
   - Verify event.detail structure matches

3. **Test with a simple tool first:**
   ```javascript
   test_tool: async () => {
     console.log("Test tool called!");
     return "Success!";
   }
   ```

4. **Enable verbose logging:**
   - Log every event received
   - Log the full event.detail object
   - Log when tools are registered

---

## 📝 Next Steps

Once the `open_document` tool is working:

1. **Test with all your documents** (vacation, expense, parental leave, termination)
2. **Refine the agent's conversation goal** to use the tool naturally
3. **Test error cases** (what if document URL is missing?)
4. **Consider adding more tools** (search documents, list all documents, etc.)
5. **Optionally upgrade to smooth-drawer** if you prefer that UX

---

**Implementation by Claude Code** 🤖
Based on analysis of your UNEET project's working implementation.
