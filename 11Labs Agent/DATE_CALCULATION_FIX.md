# Fixing Agent Date Calculation Issues

## Problem
Agent is saying "July 1-5" when user says "next week Monday to Friday" in November.

## Root Cause
LLMs don't have real-time date awareness. Without explicit context, they may use training data patterns or make incorrect assumptions.

## Solution

### 1. Update System Prompt (CRITICAL)

Add this at the **very top** of your agent's system prompt in ElevenLabs:

```markdown
## 📅 CURRENT DATE CONTEXT

**TODAY'S DATE: November 21, 2024 (Thursday)**

When calculating dates:
- "Next week" from November 21, 2024 = November 25-29, 2024 (NOT July!)
- "Tomorrow" from November 21, 2024 = November 22, 2024
- "Next Monday" from November 21, 2024 = November 25, 2024
- Always use the current year (2024) and current month context
- NEVER use past dates or wrong months like July 2024

**CRITICAL**: Before calculating any dates, check what month and year we're currently in!
```

### 2. Add Explicit Examples

Show the agent what NOT to do:

```markdown
### Example: Date Confirmation (Avoiding July Mistake)
**User:** "Next week Monday to Friday"
**You:** ❌ WRONG: "July 1st to July 5th" (This is 4 months in the past!)
**You:** ✅ CORRECT: "Monday, November 25th through Friday, November 29th, 2024"
```

### 3. Use Dynamic Variables (If Available)

In ElevenLabs, check if you can set up dynamic variables:
- Variable name: `{{current_date}}`
- Value: Auto-updated with current date
- Format: "November 21, 2024 (Thursday)"

### 4. Weekly Maintenance

If dynamic variables aren't available:
- Update the "TODAY'S DATE" in the system prompt every Monday
- Update all example dates to match current week
- Test with "next week" after updating

### 5. Test Phrases

After updating, test with these phrases:
- ✅ "Next week Monday to Friday" → Should say November 25-29
- ✅ "Tomorrow" → Should say November 22
- ✅ "Rest of this week" → Should say November 22-24
- ❌ If it says July dates → Prompt needs more emphasis

## Quick Fix for Right Now

Copy this to the **very first line** of your agent's system prompt:

```
TODAY IS NOVEMBER 21, 2024. When calculating "next week Monday-Friday", that means November 25-29, 2024. NOT July! Calculate all dates from November 21, 2024 forward.
```

## Why This Happens

1. **No Real-Time Clock**: LLMs don't know what day it is
2. **Training Data Bias**: May default to common patterns from training
3. **Ambiguous Context**: "Next week" is relative and needs a reference point
4. **Month Confusion**: Without explicit current date, may use wrong month

## Verification

After updating the prompt, you should see in the conversation:
```
User: "Next week Monday to Friday"
Agent: "You'd like vacation from Monday, November 25th through Friday, November 29th, 2024, correct?"
```

NOT:
```
Agent: "July 1st to July 5th" ❌
```

