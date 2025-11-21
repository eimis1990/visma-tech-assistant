# Troubleshooting: Absence Panel Not Opening

## Symptoms
- Agent doesn't open the side panel
- Agent doesn't select dates
- Tool seems to not be called at all

## Possible Causes & Solutions

### 1. "Wait for Response" Setting Issue

**Problem**: If you set "Wait for response" to `true` in ElevenLabs but the agent isn't configured to handle the response properly, it might block the tool execution.

**Solution A - Quick Fix (Recommended First)**:
1. Go to ElevenLabs → Absence Requests Agent → Tools
2. Find `open_absence_panel` tool
3. Set **"Wait for response"** to `false` (temporarily)
4. Save and test again

**Solution B - Proper Fix (After testing)**:
1. Keep "Wait for response" as `true`
2. Make sure the system prompt explicitly tells the agent to READ the tool response
3. Update tool description to mention it returns important date information

### 2. Tool Not Being Called

**Check Console Logs**:

Open browser console (F12) and look for:
```
✅ Client tools registered: ['open_document', 'open_absence_panel', 'fill_absence_request']
```

If you DON'T see this, the tools aren't registered. Refresh the page.

If you see this but NOT:
```
🏖️ open_absence_panel tool called by agent!
```

Then the agent isn't calling the tool. Check:
- Is the tool enabled in ElevenLabs?
- Is the tool name exactly `open_absence_panel` (case-sensitive)?
- Does the agent's system prompt tell it to call the tool?

### 3. Agent Configuration Issues

**Check in ElevenLabs**:

1. **Tool is enabled**: Make sure the toggle is ON
2. **Tool name matches**: Must be exactly `open_absence_panel`
3. **System prompt includes instructions**: Agent needs to know WHEN to call the tool
4. **Inherit custom tools is ON**: If using a subagent, make sure it inherits tools

### 4. System Prompt Too Long/Confusing

**Problem**: If the system prompt is too long or has conflicting instructions, the agent might not call tools.

**Solution**:
1. Simplify the prompt
2. Put tool instructions at the TOP
3. Make it very explicit: "CALL open_absence_panel IMMEDIATELY when user mentions vacation"

### 5. Browser Cache Issue

**Solution**:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Close and reopen the page

## Debugging Steps

### Step 1: Check Tool Registration
```javascript
// Open console and check:
✅ Client tools registered: ['open_document', 'open_absence_panel', 'fill_absence_request']
```

### Step 2: Test Tool Manually
In console, try:
```javascript
window.dispatchEvent(
  new CustomEvent("elevenlabs:client_tool_call", {
    detail: {
      tool_name: "open_absence_panel",
      parameters: {},
      call_id: "test_123"
    }
  })
);
```

If panel opens → Tool works, agent just isn't calling it
If panel doesn't open → Hook issue

### Step 3: Check Agent Transcript
1. Go to ElevenLabs dashboard
2. View conversation transcript
3. Look for tool calls in the transcript
4. If no tool calls appear → Agent isn't trying to call the tool

### Step 4: Simplify System Prompt
Try this minimal prompt:
```
You help with absence requests. 

CRITICAL: When user mentions vacation or time off, IMMEDIATELY call the open_absence_panel tool.

Then ask for dates and call fill_absence_request with the dates in YYYY-MM-DD format.
```

## Quick Test Checklist

- [ ] Tools show as registered in console
- [ ] "Wait for response" is set to `false` (for testing)
- [ ] Tool name is exactly `open_absence_panel`
- [ ] Tool is enabled in ElevenLabs
- [ ] System prompt tells agent to call the tool
- [ ] Page has been hard refreshed
- [ ] Agent is the correct subagent (Absence Requests Agent)

## If Still Not Working

1. **Revert to simple version**:
   - Set "Wait for response" to `false`
   - Simplify the tool response to just: `"Panel opened successfully"`
   - Test if panel opens

2. **Check ElevenLabs Dashboard**:
   - View the conversation transcript
   - Check if tool calls appear
   - Look for any error messages

3. **Test with other tools**:
   - Try the `open_document` tool
   - If that works but absence doesn't → Issue is specific to absence tool config
   - If neither works → General tool calling issue

## Expected Working Flow

```
User: "I want vacation"
↓
Console: "🏖️ open_absence_panel tool called by agent!"
↓
Console: "📤 Returning to agent: Absence request panel opened..."
↓
Panel opens on screen
↓
Agent asks for dates
↓
User: "Next week Monday to Friday"
↓
Console: "📝 fill_absence_request tool called by agent!"
↓
Dates appear in panel
```

If any step is missing, that's where the issue is!

