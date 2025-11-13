# 11Labs Tool Configuration Checklist

## ✅ SOLUTION IMPLEMENTED

**The issue was in the code implementation, not the 11Labs dashboard configuration.**

The previous implementation used `window.clientTools` which ElevenLabs **does not recognize**. The correct approach is to listen for the `elevenlabs-convai:call` event and register client tools on `event.detail.config.clientTools`.

**What was fixed:**
- Updated [app/components/ElevenLabsWidget.tsx](../app/components/ElevenLabsWidget.tsx) to use the `elevenlabs-convai:call` event listener
- Added proper Script component to load the ElevenLabs widget
- Client tools are now registered correctly when the agent starts a conversation

**Status:** The implementation now matches the working UNEET project approach.

---

## Troubleshooting "Client tool with name open_document is not defined on client"

This error means the tool isn't properly configured or connected in the 11Labs dashboard. Follow this checklist step by step.

---

## ✅ Step 1: Verify Tool Exists in 11Labs Dashboard

1. Log into your 11Labs dashboard
2. Navigate to your **Documents Agent** (the subagent, not the main agent)
3. Look for a **Tools** or **Client Tools** section
4. Verify a tool named `open_document` exists

**Expected Configuration:**

```
Tool Name: open_document
Tool Type: Client Tool (NOT Server Tool)
Description: Use this tool to open a company document for the user. Opens a modal with document title and link.
```

---

## ✅ Step 2: Verify Tool Type

**CRITICAL:** The tool must be a **Client Tool**, not a Server Tool.

- ✅ **Client Tool** - Triggers events in the web app (what we want)
- ❌ **Server Tool** - Makes HTTP requests to a server (wrong type)

If it's set as Server Tool, change it to Client Tool.

---

## ✅ Step 3: Verify Parameters Configuration

The tool should have exactly 2 parameters with these exact settings:

### Parameter 1: document_title
```
Data Type: String
Identifier: document_title (case-sensitive!)
Required: Yes
Value Type: LLM Prompt
Description: The title of the document to display in the modal
```

### Parameter 2: document_url
```
Data Type: String
Identifier: document_url (case-sensitive!)
Required: Yes
Value Type: LLM Prompt
Description: The Google Docs URL from the knowledge base document
```

**IMPORTANT:**
- Parameter identifiers are case-sensitive
- Must be `document_title` and `document_url` (lowercase with underscore)
- Both should use "LLM Prompt" as Value Type (not "Static Value")

---

## ✅ Step 4: Verify Tool is Enabled for Documents Agent

1. Go to **Documents Agent** settings
2. Find the **Tools** or **Available Tools** section
3. Make sure `open_document` is **enabled/checked/active** for this agent
4. If there's a toggle or checkbox, ensure it's ON

**Common mistake:** Adding the tool to the workspace but not enabling it for the specific subagent.

---

## ✅ Step 5: Check Tool Response Settings

Some 11Labs configurations have a "Wait for response" setting:

```
Wait for response: Yes/Enabled
Timeout: 10 seconds (or default)
```

This ensures the agent waits for the success response from your app before continuing the conversation.

---

## ✅ Step 6: Verify Knowledge Base Document

Your Documents Agent should have a knowledge base document attached with this information:

```markdown
1. Cancel Vacation
   - Link: https://docs.google.com/document/d/1JBThyche5tRNDf8WTGUoHV8APcZ20m4g/edit

2. Expense Compensations
   - Link: https://docs.google.com/document/d/1JRAz0Mrv1HglOJxsu5a6FoEsJ0aRYMhf/edit

3. Parental Leave 1 Month
   - Link: https://docs.google.com/document/d/1Jn3f7FNivjvDyGfTTO9u9eKc3gZDxowz/edit

4. Termination
   - Link: https://docs.google.com/document/d/1Jkz4d9G5XM-gNOieTJk1AEzHIRSO8rxc/edit
```

The agent needs this document to know which URLs to pass to the tool.

---

## ✅ Step 7: Test in Browser Console

After configuration, test if the event listener is working:

1. Open your app in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for this log when page loads:
   ```
   ElevenLabs tool listener registered
   ```

If you don't see this, check:
- Is `useElevenLabsTools` hook being called in page.tsx?
- Any JavaScript errors in console?

---

## ✅ Step 8: Test Tool Triggering

1. Ask the agent: **"I need the expense form"**
2. Watch the browser console for these logs:
   ```
   Tool call received: {tool_name: "open_document", parameters: {...}, call_id: "..."}
   Sent success response for call_id: ...
   ```

**If you see logs:** ✅ Tool is working, modal should appear

**If you don't see logs:** ❌ Tool not configured correctly in 11Labs

---

## Common Issues and Solutions

### Issue: "Tool not defined on client"

**Possible causes:**
1. Tool configured as Server Tool instead of Client Tool
2. Tool name is not exactly "open_document" (check for typos, spaces, different case)
3. Tool not enabled for Documents Agent specifically
4. Tool configuration not saved/published in 11Labs

**Solution:**
- Double-check tool type is "Client Tool"
- Verify exact spelling: `open_document` (no spaces, all lowercase)
- Make sure to Save/Publish changes in 11Labs dashboard
- Try removing and re-adding the tool

### Issue: Modal doesn't appear

**Possible causes:**
1. Event listener not registered (check console for registration log)
2. Tool parameters don't match (case-sensitive identifiers)
3. JavaScript error preventing hook from running

**Solution:**
- Open browser console and look for errors
- Verify parameter identifiers are exactly `document_title` and `document_url`
- Check Network tab for any failed requests

### Issue: Agent doesn't trigger the tool

**Possible causes:**
1. Conversation goal doesn't instruct agent to use the tool
2. Knowledge base document not attached to agent
3. Agent doesn't know when to use the tool

**Solution:**
- Check `documents-agent-conversation-goal.md` has clear instructions about using the tool
- Verify knowledge base document is attached to Documents Agent
- Look at the conversation goal section "Using the Document Opener Tool (CRITICAL)"

---

## Verification Checklist

Before testing, verify all these items:

- [ ] Tool exists in 11Labs dashboard
- [ ] Tool name is exactly `open_document` (case-sensitive)
- [ ] Tool type is "Client Tool" (not Server Tool)
- [ ] Parameter 1: `document_title` (String, Required, LLM Prompt)
- [ ] Parameter 2: `document_url` (String, Required, LLM Prompt)
- [ ] Tool is enabled for Documents Agent specifically
- [ ] Knowledge base document with URLs is attached to Documents Agent
- [ ] Conversation goal has tool usage instructions
- [ ] Changes saved/published in 11Labs dashboard
- [ ] Browser console shows "ElevenLabs tool listener registered"

---

## Testing Sequence

Once all items are checked, test with these phrases:

1. **"I need the expense form"** → Should open Expense Compensations
2. **"Cancel my vacation"** → Should open Cancel Vacation form
3. **"Parental leave form"** → Should open Parental Leave form
4. **"What documents do you have?"** → Should list 4 documents (NOT open modal)
5. **"Termination documents"** → Should open Termination documentation

**Expected behavior:**
- Agent says something brief like "Opening Expense Compensations for you."
- Agent does NOT read the URL aloud
- Modal appears immediately with document title
- "Open Document" button opens Google Doc in new tab

---

## Still Not Working?

If you've verified everything and it still doesn't work:

1. **Check 11Labs documentation** for client tool setup (their docs might have changed)
2. **Try in incognito window** to rule out browser cache issues
3. **Check 11Labs agent version** - make sure you're using the latest version
4. **Contact 11Labs support** with:
   - Agent ID: `agent_6701k9ma25k6e6ct0y27575m5s0w`
   - Tool name: `open_document`
   - Error message: "Client tool with name open_document is not defined on client"

---

## Success Indicators

You'll know it's working when:

✅ No "tool not defined" errors in console
✅ Console shows "Tool call received" when you ask for documents
✅ Modal appears with correct document title
✅ "Open Document" button works and opens Google Doc
✅ Agent continues conversation after opening document
✅ Agent never reads URLs aloud

---

## Quick Reference: Correct 11Labs Configuration

```yaml
Tool Configuration:
  name: "open_document"
  type: "Client Tool"
  description: "Opens a company document modal for the user"

  parameters:
    - identifier: "document_title"
      type: "String"
      required: true
      value_type: "LLM Prompt"

    - identifier: "document_url"
      type: "String"
      required: true
      value_type: "LLM Prompt"

  settings:
    wait_for_response: true
    timeout: 10

  enabled_for:
    - "Documents Agent"
```

**Remember:** The tool configuration in 11Labs is the source of truth. If it's not configured correctly there, no amount of code changes will fix it.
