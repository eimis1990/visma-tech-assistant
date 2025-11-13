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
