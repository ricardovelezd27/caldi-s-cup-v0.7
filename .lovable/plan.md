

# Fix: Scanner Tribe Match Hallucination (Prompt + Matching Logic)

## Root Cause

Line 551 serializes the **entire** `sanitizedData` object (including `jargonExplanations` and `brandStory`) into one string for keyword matching:

```typescript
const allText = JSON.stringify(sanitizedData).toLowerCase();
```

When the AI explains *"Caturra is a natural mutation of **Bourbon**"* in jargon, the Owl tribe keywords "Bourbon" and "Typica" match against that educational text -- not the coffee's actual variety (Caturra). This inflates the score from ~30% to ~80%.

## Changes (single file: `supabase/functions/scan-coffee/index.ts`)

### 1. Fix keyword matching to search only coffee attributes (lines 550-568)

Replace `JSON.stringify(sanitizedData)` with a targeted string built from only the coffee's own identifying attributes:

- `coffeeName`, `brand`
- `variety`, `processingMethod`
- `legacyRoastLevel` (text roast descriptor)
- `originCountry`, `originRegion`, `originFarm`
- `flavorNotes` (joined)

**Excluded** from matching: `jargonExplanations`, `brandStory`, `awards`, numeric scores.

```typescript
// Build search text from ONLY the coffee's actual attributes
const attributeText = [
  sanitizedData.coffeeName,
  sanitizedData.brand,
  sanitizedData.variety,
  sanitizedData.processingMethod,
  sanitizedData.legacyRoastLevel,
  sanitizedData.originCountry,
  sanitizedData.originRegion,
  sanitizedData.originFarm,
  ...sanitizedData.flavorNotes,
].filter(Boolean).join(" ").toLowerCase();
```

### 2. Strengthen the tribe context in the prompt (line 384-386)

Update the tribe context instruction to tell the AI to assess the match based strictly on the coffee's own extracted attributes, not on educational/descriptive text:

**Before:**
```
The user's Coffee Tribe is "${userTribe}" with preference keywords: ${tribeKeywords.join(", ")}.
Consider these when calculating the tribe match score.
```

**After:**
```
The user's Coffee Tribe is "${userTribe}" with preference keywords: ${tribeKeywords.join(", ")}.
IMPORTANT: When assessing tribe alignment, evaluate ONLY based on this coffee's own
variety, processing method, roast level, origin, and flavor notes.
Do NOT let references to other varietals or methods in jargon explanations
influence the match assessment. For example, if the variety is "Caturra",
do not count "Bourbon" as a match just because Caturra descends from Bourbon.
```

### 3. No model change

Keep `google/gemini-2.5-flash` as-is. The hallucination is caused by the matching logic, not the model's extraction accuracy.

## Impact

| Scenario | Before | After |
|----------|--------|-------|
| Caturra coffee, Owl tribe | ~80% (false Bourbon/Typica match from jargon) | ~30-50% (correct: no direct Owl keywords in attributes) |
| Actual Bourbon coffee, Owl tribe | ~80% | ~80% (correct: Bourbon is in variety field) |
| Natural process coffee, Hummingbird | ~65% | ~65% (unchanged: "Natural" is in processingMethod) |

Works across all 4 tribes since the fix is in the generic matching logic, not tribe-specific code.

## Implementation

Single file edit with 2 changes, auto-deploys as edge function.

