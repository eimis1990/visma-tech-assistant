# Absence Request Client Tools Setup Guide

This guide explains how to configure the Client Tools in ElevenLabs to enable voice control for the Absence Request Panel.

## 1. Create `open_absence_panel` Tool

This tool allows the agent to open the side panel when the conversation about absence starts. **IMPORTANT**: This tool also returns the current date to help you calculate dates correctly.

**Tool Configuration:**
- **Name**: `open_absence_panel`
- **Description**: **CRITICAL: Call this tool IMMEDIATELY when the user mentions vacation, time off, or absence requests. This opens the absence request side panel UI for the user AND returns the current date for accurate date calculations. You MUST call this tool - do not just say you've opened it. Call it as your FIRST action when handling absence requests.**
- **Wait for response**: `true` ⚠️ **MUST BE TRUE** - The tool returns the current date that you need for calculations!

**Parameters**: None

**Tool Response**: The tool will return the current date in the response. Use this date as your reference point for all date calculations!

### Better Description (Copy this to ElevenLabs):
```
Opens the absence request side panel interface and returns the CURRENT DATE. MUST be called immediately when user mentions: vacation, time off, absence, leave, PTO, or requesting days off. Call this tool FIRST before asking for details. The tool response will tell you today's date - use this to calculate "next week", "tomorrow", etc. Do not just say "I've opened the panel" - actually call this tool and read the response for the current date.
```

## 2. Create `fill_absence_request` Tool

This tool allows the agent to fill in the form details based on the user's request.

**Tool Configuration:**
- **Name**: `fill_absence_request`
- **Description**: **Fills the absence request form with dates and type. Call this AFTER you have collected: (1) specific dates in YYYY-MM-DD format, and (2) the type of leave. You must calculate exact dates from user input like "next week" or "December 20-22". After calling this tool, tell the user to review and press Send.**
- **Wait for response**: `false`

**Parameters**:

| Identifier | Data Type | Description | Required |
|------------|-----------|-------------|----------|
| `absence_type` | String | The type of absence. Must be EXACTLY one of: "Vacation", "Parental Leave", "Unpaid Leave". Match the capitalization exactly. | Yes |
| `start_date` | String | The start date in YYYY-MM-DD format (e.g., 2024-12-20). You must calculate this from user input. | Yes |
| `end_date` | String | The end date in YYYY-MM-DD format (e.g., 2024-12-22). If single day, use same as start_date. | Yes |

### Better Description (Copy this to ElevenLabs):
```
Fills the absence form with dates and type. Call AFTER collecting: dates (convert to YYYY-MM-DD) and type (must be exactly: "Vacation", "Parental Leave", or "Unpaid Leave"). Calculate specific dates from phrases like "next Monday" or "rest of this week". After calling, tell user to review and press Send button.
```

## 3. Set Up Dynamic Variable for Current Date

**CRITICAL STEP**: ElevenLabs supports dynamic variables. You MUST set this up for correct date calculations.

**In ElevenLabs Dashboard:**

1. Go to your **Absence Requests Agent** settings
2. Navigate to the **"Dynamic Variables"** or **"Variables"** section
3. Click **"Add Variable"** or **"Create Variable"**
4. Configure the variable:
   - **Variable Name**: `current_date`
   - **Variable Type**: Choose "Date" or "Custom" depending on options
   - **Format/Value**: Set it to return today's date in this format: `November 21, 2024 (Thursday)`
   - **Update Frequency**: Real-time or daily

5. **Test the variable**: In the system prompt, use `{{current_date}}` and verify it shows the actual current date

**Variable Format Examples:**
- ✅ Good: "November 21, 2024 (Thursday)"
- ✅ Good: "2024-11-21 (Thursday, November 21)"
- ❌ Bad: "11/21/24" (too ambiguous)
- ❌ Bad: "2024-11-21" (missing day of week context)

**If you can't find the exact format option:**
- Use JavaScript/Expression: `new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })`
- Or use a webhook that returns formatted date

## 4. Update Agent System Prompt

Add the following instructions to your agent's system prompt (in `11Labs Agent/absence-requests-agent-conversation-goal.md` or directly in ElevenLabs):

**IMPORTANT**: Make sure to include the current date at the very top of the prompt!

```markdown
### Tool Usage

1. **Opening the Panel**:
   - As soon as the user mentions wanting to request time off or manage absences, call `open_absence_panel` to show them the interface.
   - Example: "I can help with that. [Calls open_absence_panel] I've opened the request panel for you."

2. **Filling the Request**:
   - Collect the *dates* and *type of leave* from the user.
   - Once you have the details, call `fill_absence_request`.
   - *Important*: You must calculate the specific dates (YYYY-MM-DD) based on the user's input (e.g., "next Monday to Friday").
   - Confirm to the user: "I've selected those dates for you. Please review the form and press Send when you're ready."
```

## 5. Testing

1. Start the conversation.
2. Say: "I want to take a vacation." -> The panel should open.
3. Say: "I need off next week from Monday to Friday for vacation." 
4. **CRITICAL CHECK**: Agent should say "November 25-29" (or current week dates), NOT "July 1-5"!
5. Verify the dates and type are selected in the UI with correct month.

## Troubleshooting Date Issues

If the agent is using wrong months (like July instead of November):

1. **Check the system prompt** - Make sure the current date is at the very top
2. **Add explicit examples** - Show correct date calculations in the prompt
3. **Use dynamic variables** - If available in ElevenLabs, set up {{current_date}}
4. **Test with specific dates** - Say "December 20-27" instead of "next week" to verify tool works
5. **Update prompt weekly** - If no dynamic variables, manually update the current date in the prompt

