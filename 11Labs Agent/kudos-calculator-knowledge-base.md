# Kudos Calculator - Agent Knowledge Base

This document provides complete formulas and logic for helping Visma employees with three main kudos scenarios. You will perform all calculations yourself during the conversation - no tools are needed.

## Three Main Scenarios

1. **How much will an item cost?** - Calculate Kudos needed for a specific price
2. **Leaving Visma - how much do I pay?** - Calculate depreciation payment when leaving company
3. **What can my Kudos buy?** - Calculate maximum item price from available Kudos

---

## SCENARIO 1: How Much Will an Item Cost?

### Formula
```
Kudos = Price / (VAT_factor) / (Team_factor) * (Tax_multiplier)
```

### Input Questions (Ask in this order)
1. **What is the item price in EUR?** (e.g., 245.00)
2. **Does this price include VAT?** (Yes/No)
3. **Is this a team purchase?** (Yes/No)
4. **Is the item whitelisted?** (Yes/No)
5. **Do you want to buy it with all taxes?** (Yes/No)

### Calculation Steps

**Step 1: Determine VAT_factor**
```
IF price includes VAT:
    VAT_factor = 1.21
ELSE:
    VAT_factor = 1
```

**Step 2: Determine Team_factor**
```
IF team purchase:
    Team_factor = 1.5
ELSE:
    Team_factor = 1
```

**Step 3: Determine Tax_multiplier**
```
IF whitelisted = Yes AND buying_with_taxes = No:
    Tax_multiplier = 1
ELSE:
    Tax_multiplier = 1.21 * 1.43 = 1.7303
```

**Step 4: Calculate Kudos**
```
Kudos = Price / VAT_factor / Team_factor * Tax_multiplier
Kudos_final = ROUND UP to nearest whole number
```

### Worked Example 1: Personal, Whitelisted, With Taxes
- Price: 245.00 EUR (VAT included)
- Team purchase: No
- Whitelisted: Yes
- Buying with taxes: Yes

```
Step 1: VAT_factor = 1.21 (price includes VAT)
Step 2: Team_factor = 1 (personal purchase)
Step 3: Tax_multiplier = 1.7303 (whitelisted but buying WITH taxes)
Step 4: Kudos = 245 / 1.21 / 1 * 1.7303
        = 202.48 * 1.7303
        = 350.35
        = 350 Kudos (rounded up)
```

**Answer:** "You need **350 Kudos** for this personal purchase with all taxes included. The item will be fully yours."

### Worked Example 2: Personal, Whitelisted, Without Taxes
- Price: 121.00 EUR (VAT included)
- Team purchase: No
- Whitelisted: Yes
- Buying with taxes: No

```
Step 1: VAT_factor = 1.21
Step 2: Team_factor = 1
Step 3: Tax_multiplier = 1 (whitelisted AND not buying with taxes)
Step 4: Kudos = 121 / 1.21 / 1 * 1
        = 100 / 1
        = 100 Kudos
```

**Answer:** "You need **100 Kudos**. Since you're buying without taxes, the item belongs to Visma Tech. Depreciation applies if you leave."

### Worked Example 3: Team Purchase, Whitelisted, Without Taxes
- Price: 181.50 EUR (VAT included)
- Team purchase: Yes
- Whitelisted: Yes
- Buying with taxes: No

```
Step 1: VAT_factor = 1.21
Step 2: Team_factor = 1.5
Step 3: Tax_multiplier = 1 (whitelisted AND not buying with taxes)
Step 4: Kudos = 181.50 / 1.21 / 1.5 * 1
        = 150 / 1.5
        = 100 Kudos
```

**Answer:** "You need **100 Kudos** for this team purchase. The item belongs to the team and must stay with the team when members leave."

### Key Rules for Scenario 1
- **Whitelisted + Without taxes = Cheapest option** (Tax_multiplier = 1)
- **Team purchases = Better rate** (divide by 1.5, so get 50% more buying power)
- **Buying with taxes = Higher cost** but you own the item immediately
- **Not whitelisted OR buying with taxes = Apply 1.7303 multiplier** (21% VAT + 43% kudos tax)

---

## SCENARIO 2: Leaving Visma - How Much Do I Need to Pay?

### Formula
```
IF team_purchase = Yes:
    Payment = "-" (Cannot take team items)
ELSE IF paid_all_taxes = Yes:
    Payment = 0 EUR (Item is already yours)
ELSE IF original_kudos = 0:
    Payment = 0 EUR
ELSE IF months_since_purchase >= 36:
    Payment = 1 EUR (Fully depreciated)
ELSE:
    Payment = (Original_Kudos * (36 - months_since_purchase) / 36) * 1.21
```

### Input Questions (Ask in this order)
1. **What was the original value in Kudos?** (e.g., 54)
2. **Was this a team purchase?** (Yes/No)
3. **Did you pay all taxes when buying (or was the item not whitelisted)?** (Yes/No)
4. **When was the item purchased?** (yyyy-MM format, e.g., 2025-11-05)

### Calculation Steps

**Step 1: Check if team purchase**
```
IF team_purchase = Yes:
    RETURN "-" (Item must stay with the team)
    STOP
```

**Step 2: Check if taxes were paid**
```
IF paid_all_taxes = Yes:
    RETURN 0 EUR (Item already belongs to you)
    STOP
```

**Step 3: Calculate months since purchase**
```
months_elapsed = (Current_date - Purchase_date) in months
```

**Step 4: Calculate depreciation payment**
```
IF months_elapsed >= 36:
    Payment = 1 EUR (Fully depreciated, symbolic payment)
ELSE:
    Remaining_kudos = Original_Kudos * (36 - months_elapsed) / 36
    Payment = Remaining_kudos * 1.21 EUR
    Round to 2 decimal places
```

### Worked Example 1: Team Purchase
- Original value: 54 Kudos
- Team purchase: Yes
- Paid taxes: Yes
- Purchase date: 2025-11-05

```
Step 1: team_purchase = Yes
RESULT: "-" Cannot take this item
```

**Answer:** "This was a team purchase - the item must stay with the team. You cannot take it when leaving."

### Worked Example 2: Personal, Taxes Paid
- Original value: 54 Kudos
- Team purchase: No
- Paid taxes: Yes
- Purchase date: 2025-11-05

```
Step 1: team_purchase = No (continue)
Step 2: paid_all_taxes = Yes
RESULT: 0 EUR
```

**Answer:** "You paid all taxes when purchasing, so the item is fully yours. **You don't need to pay anything** when leaving."

### Worked Example 3: Personal, No Taxes, Recent Purchase
- Original value: 54 Kudos
- Team purchase: No
- Paid taxes: No
- Purchase date: 2025-11-05 (just purchased)
- Current date: 2025-11-16 (0 months elapsed)

```
Step 1: team_purchase = No (continue)
Step 2: paid_all_taxes = No (continue)
Step 3: months_elapsed = 0
Step 4: Remaining_kudos = 54 * (36 - 0) / 36 = 54 * 1 = 54
        Payment = 54 * 1.21 = 65.34 EUR
```

**Answer:** "You need to pay **65.34 EUR** to keep this item. Tech equipment depreciates over 3 years."

### Worked Example 4: Personal, No Taxes, After 3 Years
- Original value: 100 Kudos
- Team purchase: No
- Paid taxes: No
- Purchase date: 2022-11-05
- Current date: 2025-11-16 (36+ months elapsed)

```
Step 1: team_purchase = No (continue)
Step 2: paid_all_taxes = No (continue)
Step 3: months_elapsed = 36+
Step 4: months_elapsed >= 36
RESULT: 1 EUR
```

**Answer:** "The item is fully depreciated after 3 years. You only need to pay **1 EUR** to keep it."

### Key Rules for Scenario 2
- **Team items cannot be taken** - they stay with the team
- **If you paid all taxes = 0 EUR** - item is already yours
- **Tech equipment depreciates over 36 months** (3 years)
- **Non-tech equipment may have different depreciation** - consult Kudos Committee
- **Depreciation is linear**: remaining_value = original * (36 - months) / 36
- **Payment is in EUR with VAT**: remaining_kudos * 1.21
- **After 36 months = 1 EUR** symbolic payment

**IMPORTANT NOTE:** The 36-month depreciation period applies to **tech equipment only** (laptops, monitors, keyboards, etc.). For non-tech items (furniture, appliances, etc.), depreciation may vary. If a user asks about a non-tech item, inform them to consult the Kudos Committee for the specific depreciation period.

---

## SCENARIO 3: What Can My Kudos Buy?

This is the reverse of Scenario 1. Given Kudos, calculate maximum affordable price.

### Formula
```
Max_Price_excl_VAT = Kudos * Multiplier
Max_Price_incl_VAT = Max_Price_excl_VAT * 1.21
```

### Input Questions (Ask in this order)
1. **How many Kudos do you have?** (e.g., 100)
2. **Is this for personal use or team purchase?** (Personal/Team)
3. **Do you want to buy with all taxes included?** (Yes/No)

### Multiplier Table

| Purchase Type | With Taxes | Multiplier | What 100 Kudos Buys (excl. VAT) |
|---------------|------------|------------|----------------------------------|
| Personal | No | 1.000 | 100.00 EUR |
| Personal | Yes | 0.578 | 57.79 EUR |
| Team | No | 1.500 | 150.00 EUR |
| Team | Yes | 0.867 | 86.69 EUR |

**How multipliers are derived:**
- **Personal, No taxes**: 1.000 (base rate: 1 Kudos = 1 EUR excl. VAT)
- **Team, No taxes**: 1.500 (team bonus: 1 Kudos = 1.5 EUR excl. VAT)
- **Personal, With taxes**: 1 / 1.7303 = 0.578 (pay penalty for ownership)
- **Team, With taxes**: 1.5 / 1.7303 = 0.867 (team bonus but still pay penalty)

### Worked Example 1: Personal, Without Taxes
- Kudos: 100
- Personal or Team: Personal
- With taxes: No

```
Multiplier = 1.000
Max_Price_excl_VAT = 100 * 1.000 = 100.00 EUR
Max_Price_incl_VAT = 100 * 1.21 = 121.00 EUR
```

**Answer:** "With 100 Kudos, you can buy an item for up to:
- **121 EUR** (with VAT) or
- **100 EUR** (without VAT)

Note: Item belongs to Visma Tech since you're not buying with taxes."

### Worked Example 2: Team Purchase, Without Taxes
- Kudos: 100
- Personal or Team: Team
- With taxes: No

```
Multiplier = 1.500
Max_Price_excl_VAT = 100 * 1.500 = 150.00 EUR
Max_Price_incl_VAT = 150 * 1.21 = 181.50 EUR
```

**Answer:** "With 100 Kudos for a team purchase, you can buy an item for up to:
- **181.50 EUR** (with VAT) or
- **150 EUR** (without VAT)

Item belongs to the team and stays with the team when members leave."

### Worked Example 3: Personal, With Taxes
- Kudos: 100
- Personal or Team: Personal
- With taxes: Yes

```
Multiplier = 0.578
Max_Price_excl_VAT = 100 * 0.578 = 57.79 EUR (rounded)
Max_Price_incl_VAT = 57.79 * 1.21 = 69.93 EUR
```

**Answer:** "With 100 Kudos, buying with all taxes included, you can afford:
- **69.93 EUR** (with VAT) or
- **57.79 EUR** (without VAT)

The item will be fully yours - no payment needed when leaving."

### Worked Example 4: Team Purchase, With Taxes
- Kudos: 100
- Personal or Team: Team
- With taxes: Yes

```
Multiplier = 0.867
Max_Price_excl_VAT = 100 * 0.867 = 86.69 EUR (rounded)
Max_Price_incl_VAT = 86.69 * 1.21 = 104.90 EUR
```

**Answer:** "With 100 Kudos for a team purchase with taxes, you can afford:
- **104.90 EUR** (with VAT) or
- **86.69 EUR** (without VAT)

Item belongs to the team."

### Key Rules for Scenario 3
- **Team purchases give better rates** (1.5x multiplier without taxes)
- **Buying without taxes = More purchasing power** but item belongs to Visma
- **Buying with taxes = Less purchasing power** but you own it immediately
- **Always show both prices**: with VAT and without VAT

---

## Constants Reference

```
VAT_RATE = 0.21 (21%)
TAX_PENALTY = 1.21 * 1.43 = 1.7303 (VAT + 43% kudos tax)
TEAM_MULTIPLIER = 1.5 (team purchases get 50% more buying power)
DEPRECIATION_PERIOD = 36 months (3 years for tech equipment)
```

---

## Important Ownership Rules

### Whitelisted Items (Tax-Free Option Available)
- **Without taxes**: Item belongs to Visma Tech, depreciation applies
- **With taxes**: Item belongs to you immediately, costs more Kudos

Examples: Laptops, monitors, keyboards, work chairs, tech equipment

### Greylist Items (Must Pay Taxes)
- Always require VAT + 43% kudos tax
- Item belongs to you immediately
- No depreciation concerns

Examples: Smartwatches, household appliances, cameras

### Team Purchases
- **Always stay with the team** when any member leaves
- Cannot be bought out or taken by individuals
- Better Kudos rates (1.5x multiplier)

---

## Quick Decision Tree

**User asks about buying an item:**
1. Is it whitelisted? → Affects tax multiplier
2. Personal or team? → Affects team factor (1 or 1.5)
3. With or without taxes? → Affects tax multiplier (1 or 1.7303)
4. Calculate using Scenario 1 formula

**User asks about leaving Visma:**
1. Was it a team purchase? → Cannot take it
2. Did they pay all taxes? → 0 EUR payment
3. How long ago purchased? → Calculate depreciation using Scenario 2

**User asks what they can afford:**
1. Personal or team? → Choose multiplier
2. With or without taxes? → Choose multiplier
3. Calculate using Scenario 3 formula

---

## Tips for Agent

1. **Always ask about "whitelisted"** in Scenario 1 - it's critical for the calculation
2. **Round UP Kudos** when calculating cost (CEILING function)
3. **Round to 2 decimals for EUR** when showing prices
4. **Show both VAT-included and excluded** prices for clarity
5. **Remind users about ownership** based on their choices
6. **Be precise with months** in depreciation calculations
7. **Team items are non-negotiable** - they cannot be taken

---

Remember: You have all formulas here. Calculate everything yourself step-by-step. Show your work to build trust with users!
