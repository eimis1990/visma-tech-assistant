# Routing Conditions for Specialized Agents

This document contains the Label and LLM Condition for each transition from the Routing Agent to specialized subagents in the 11Labs workflow.

---

## 1. Routing Agent → Onboarding Agent

**Label:**
```
Route to Onboarding
```

**LLM Condition:**
```
The user is asking about getting started with the company, new employee orientation, onboarding processes, company guidelines for new hires, initial setup procedures, first-day information, or how to begin working at Visma.
```

---

## 2. Routing Agent → Documents Agent

**Label:**
```
Route to Documents
```

**LLM Condition:**
```
The user is asking about vacation forms, company policies documentation, important files, templates, document downloads, where to find specific forms, or needs access to any company documents or paperwork.
```

---

## 3. Routing Agent → People Agent

**Label:**
```
Route to People
```

**LLM Condition:**
```
The user is asking about finding employees by technology or skills, looking for team member information, wants to know who works on specific projects, needs to find employees with specific expertise or specializations, or is looking for contact information for specific roles.
```

---

## 4. Routing Agent → Kudos Calculator Agent

**Label:**
```
Route to Kudos Calculator
```

**LLM Condition:**
```
The user is asking about kudos budget, kudos expenses, calculating kudos allocations, kudos spending limits, kudos program information, or anything related to kudos financial tracking.
```

---

## 5. Routing Agent → Absence Requests Agent

**Label:**
```
Route to Absence Requests
```

**LLM Condition:**
```
The user is asking about requesting vacation or time off, managing PTO (Paid Time Off), checking vacation balances, absence request procedures, holiday planning, submitting leave requests, or time off management.
```

---

## 6. Routing Agent → Employee Handbook Agent

**Label:**
```
Route to Employee Handbook
```

**LLM Condition:**
```
The user is asking about workplace policies, benefits, health insurance, remote work guidelines, office rules, security policies, working hours, salary information, well-being programs, parking, office facilities, communication tools, or other information from the employee handbook.
```

---

## Implementation Notes

- Each LLM condition is written as a natural language description that the AI will evaluate
- The conditions cover the key scenarios mentioned in the routing agent's conversation goal
- There may be some overlap between categories (e.g., "workplace policies" could be Documents or Employee Handbook)
- The routing agent will use these conditions to determine the best match based on user intent
- If multiple conditions could match, the routing agent should choose the most specific one

## Testing Recommendations

Test each route with example user queries:

1. **Onboarding**: "I'm new here, where do I start?"
2. **Documents**: "Where can I find the vacation request form?"
3. **People**: "Who on our team knows React?"
4. **Kudos Calculator**: "How much kudos budget do I have left?"
5. **Absence Requests**: "I need to request time off next week"
6. **Employee Handbook**: "What are our remote work policies?"

---

# Return to Routing Agent Conditions

This section defines when specialized subagents should route back to the Routing Agent.

---

## 7. Onboarding Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of onboarding and getting started at Visma. This includes: requesting or managing time off/absences, finding or downloading company documents or forms, searching for specific employees or team members by skills, calculating kudos budget or expenses, asking about detailed workplace policies from the employee handbook, or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject.
```

---

## 8. Documents Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of finding and accessing company documents. This includes: the process of submitting or managing vacation/absence requests (not just getting the form), onboarding or getting started at the company, finding specific employees by skills or technology, calculating kudos budget or expenses, interpreting detailed workplace policies from the employee handbook, or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject. Note: If they just want a document/form itself, stay in Documents - only route back for process questions or other topics.
```

---

## 9. People Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of finding employees by skills, technology, or expertise. This includes: requesting or managing vacation/absence time off, accessing or downloading company documents or forms, onboarding or getting started at the company, calculating kudos budget or expenses, interpreting detailed workplace policies from the employee handbook, or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject. Note: If they want to find specific people or team members, stay in People - only route back for other topics.
```

---

## 10. Kudos Calculator Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of kudos calculations, budgets, expenses, and purchase guidelines. This includes: finding specific employees by skills or technology, requesting or managing vacation/absence time off, accessing or downloading company documents or forms, onboarding or getting started at the company, interpreting detailed workplace policies beyond kudos program, or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject. Note: If they want kudos calculations, budget tracking, expense calculations, or purchase category questions (Whitelist/Greylist/Blacklist), stay in Kudos Calculator - only route back for other topics.
```

---

## 11. Absence Requests Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of requesting NEW time off, managing NEW vacation requests, or PTO policies. This includes: CANCELING or WITHDRAWING existing vacation/absence (needs Documents Specialist for Cancel Vacation form), finding specific employees by skills or technology, accessing or downloading company documents or forms, onboarding or getting started at the company, calculating kudos budget or expenses, interpreting detailed workplace policies from the employee handbook (beyond absence/vacation policies), or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject. Note: If they want to submit NEW absence requests, check PTO balance, or understand vacation policies, stay in Absence Requests - only route back for cancellations or other topics.
```

---

## 12. Employee Handbook Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of workplace policies, benefits, guidelines, and handbook information. This includes: requesting or managing vacation/absence time off (the handbook agent explains policies, but routing should happen if user wants to actually submit a request), finding specific employees by skills or technology, accessing or downloading specific company documents or forms, onboarding step-by-step guidance, calculating kudos budget or expenses, or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject. Note: If they want to understand policies, benefits, security guidelines, remote work rules, or other handbook information, stay in Employee Handbook - only route back for actionable requests or other topics.
```

---

---

# Return to Routing Agent Conditions

This section defines when specialized subagents should route back to the Routing Agent.

---

## 7. Onboarding Agent → Routing Agent

**Label:**
```
Return to Routing
```

**LLM Condition:**
```
The user is asking about topics outside of onboarding and getting started at Visma. This includes: requesting or managing time off/absences, finding or downloading company documents or forms, searching for specific employees or team members by skills, calculating kudos budget or expenses, asking about detailed workplace policies from the employee handbook, or explicitly wanting to change topics or ask about something different. Also route back if the user says they want to go back, ask something else, or change the subject.
```

---
