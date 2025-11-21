# Passing Current Date via Client Tool

## Problem Solved
Subagents in ElevenLabs don't support dynamic variables, so we can't use `{{current_date}}`. 

## Solution
Pass the current date **in the tool's response** when `open_absence_panel` is called!

## How It Works

### 1. Client Tool Returns Current Date

When the agent calls `open_absence_panel`, the tool now returns:

```
"Absence request panel opened successfully. 
CURRENT DATE: Thursday, November 21, 2024. 
For reference: Next Monday is November 25, 2024. 
Use this date as your reference point for calculating 'next week' or other relative dates."
```

### 2. Agent Reads the Response

The agent receives this response and can extract:
- Current date: "Thursday, November 21, 2024"
- Next Monday: "November 25, 2024"

### 3. Agent Uses It for Calculations

The agent now knows:
- "Next week Monday to Friday" = November 25-29, 2024
- NOT July 1-5!

## Implementation

### Code Changes (ElevenLabsWidget.tsx)

```typescript
open_absence_panel: async () => {
  // Get current date information
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Calculate next Monday
  const nextMonday = new Date(now);
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  
  const nextMondayStr = nextMonday.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Open panel...
  
  // Return current date context
  return `Absence request panel opened successfully. CURRENT DATE: ${dateStr}. For reference: Next Monday is ${nextMondayStr}. Use this date as your reference point.`;
}
```

### ElevenLabs Configuration

**CRITICAL**: In the tool configuration, set:
- **Wait for response**: `true` ✅

This ensures the agent waits for and reads the tool's response containing the current date!

## Agent Instructions Update

The system prompt now says:

```markdown
## 📅 CURRENT DATE CONTEXT

**IMPORTANT**: When you call the `open_absence_panel` tool, it will return 
the current date in its response. **YOU MUST READ THIS DATE** and use it 
for all date calculations!

The tool response will tell you: "CURRENT DATE: [date]" and "Next Monday is [date]"
Use this information to calculate all relative dates.
```

## Testing

### Before Fix:
```
User: "Next week Monday to Friday"
Agent: "July 1st to July 5th" ❌
```

### After Fix:
```
User: "Next week Monday to Friday"
Agent calls open_absence_panel → receives "CURRENT DATE: Thursday, November 21, 2024"
Agent: "November 25th through 29th, 2024" ✅
```

## Advantages

1. ✅ **No dynamic variables needed** - Works with subagents
2. ✅ **Always accurate** - Date is calculated in real-time by JavaScript
3. ✅ **Automatic** - Agent gets the date every time it opens the panel
4. ✅ **Helpful context** - Also provides "Next Monday" to make calculations easier

## What You Need to Do

1. **Update tool in ElevenLabs**:
   - Set "Wait for response" to `true`
   - Update description to mention it returns current date

2. **Update system prompt**:
   - Copy the updated `absence-requests-agent-conversation-goal.md`
   - Emphasize reading the tool response for the date

3. **Test**:
   - Say "I want vacation next week"
   - Agent should call tool and receive current date
   - Agent should calculate correct dates (November, not July!)

## Console Output

You should see:
```
🏖️ open_absence_panel tool called by agent!
📤 Returning to agent: Absence request panel opened successfully. 
    CURRENT DATE: Thursday, November 21, 2024. 
    For reference: Next Monday is November 25, 2024.
```

The agent will then use this information for date calculations! 🎯

