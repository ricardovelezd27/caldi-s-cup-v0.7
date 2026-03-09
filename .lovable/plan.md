

# Upgrade ExerciseEditor: Type-Aware Forms + Remove Calculation

## Summary

Replace the raw JSON textarea in ExerciseEditor with dynamic, type-specific form sub-components. Each exercise type gets intuitive labeled inputs that build the `question_data` object behind the scenes. Also remove `calculation` from the system entirely.

## Data Shapes (from existing components)

| Type | Key Fields |
|------|-----------|
| `true_false` | `statement`, `statement_es`, `correct_answer` (bool), `explanation`, `explanation_es` |
| `multiple_choice` | `question`, `question_es`, `options[]` ({id, text, text_es}), `correct_answer` (string id), `explanation`, `explanation_es` |
| `fill_in_blank` | `question`, `question_es`, `blanks[]` ({id, correct_answers[]}), `explanation`, `explanation_es` |
| `matching_pairs` | `instruction`, `instruction_es`, `pairs[]` ({id, left, left_es, right, right_es}), `explanation`, `explanation_es` |
| `sequencing` | `instruction`, `instruction_es`, `items[]` ({id, text, text_es}), `correct_order[]`, `explanation`, `explanation_es` |
| `image_identification` | Same as multiple_choice + `instruction`/`instruction_es` |
| `categorization` | `instruction`, `instruction_es`, `categories[]`, `items[]` (with category_id), `explanation`, `explanation_es` |
| `troubleshooting` | `scenario`, `scenario_es`, `question`, `question_es`, `options[]` (with is_correct bool), `explanation`, `explanation_es` |
| `recipe_building` | Complex (method, variables, valid_combinations) -- keep JSON fallback |
| `prediction` | `scenario`, `scenario_es`, `question`, `question_es`, `options[]`, `correct_answer`, `explanation`, `explanation_es` |
| `comparison` | `question`, `question_es`, `item_a`, `item_b`, `attribute`, `correct_answer` (a/b/equal), `explanation`, `explanation_es` |

## Plan

### 1. Create sub-form components (new files)

**`src/features/admin/learning/components/exercise-forms/TrueFalseForm.tsx`**
- Props: `data: Record<string, any>`, `onChange: (data) => void`
- Renders: Input for "Statement (EN)", Input for "Statement (ES)", Switch for "Correct Answer" (True/False), Input for "Explanation (EN)", Input for "Explanation (ES)"
- On every field change, calls `onChange` with the full updated object

**`src/features/admin/learning/components/exercise-forms/MultipleChoiceForm.tsx`**
- Renders: Input for "Question (EN)", "Question (ES)"
- Dynamic options list: each option row has Input for text (EN), Input for text (ES), RadioGroupItem to mark as correct, Trash icon Button to remove
- "Add Option" button at the bottom
- Input for "Explanation (EN)", "Explanation (ES)"
- Auto-generates option IDs (e.g., `opt_1`, `opt_2`, etc.) when adding

**`src/features/admin/learning/components/exercise-forms/FillInBlankForm.tsx`**
- Input for "Question with {blank} tokens (EN)", "Question (ES)"
- Dynamic blanks list: each blank has an Input for comma-separated accepted answers
- Explanation fields

**`src/features/admin/learning/components/exercise-forms/MatchingPairsForm.tsx`**
- Instruction (EN/ES) inputs
- Dynamic pairs list: each row has Left (EN), Left (ES), Right (EN), Right (ES), Trash button
- Add Pair button
- Explanation fields

**`src/features/admin/learning/components/exercise-forms/SequencingForm.tsx`**
- Instruction (EN/ES) inputs
- Dynamic items list with Text (EN), Text (ES), Trash button
- Items appear in correct order (the order in the list IS the correct_order)
- Explanation fields

**`src/features/admin/learning/components/exercise-forms/GenericJsonForm.tsx`**
- Fallback for complex types (recipe_building, categorization, troubleshooting, prediction, comparison, image_identification)
- Keeps the raw JSON textarea approach as-is
- Will be replaced with dedicated forms in future iterations

### 2. Refactor `ExerciseEditor.tsx`

- Remove the JSON `<Textarea>` and `jsonStr`/`jsonError` state
- Add `questionData` state initialized from `exercise.question_data`
- Based on `exercise.exercise_type`, render the appropriate sub-form component
- Each sub-form calls `onChange` which updates `questionData` state
- On Save, pass `questionData` directly as `question_data` (no JSON.parse needed for typed forms)
- For `GenericJsonForm`, keep the JSON string parse logic encapsulated within that component

### 3. Remove `calculation` type

**Files to modify:**
- `src/features/learning/types/learning.ts` -- Remove `'calculation'` from `ExerciseType` union
- `src/features/learning/components/lesson/ExerciseRenderer.tsx` -- Remove the calculation case and import
- `src/features/admin/learning/types/adminTypes.ts` -- No change needed (type is a string, validated at content level)
- `src/features/admin/learning/services/contentValidator.ts` -- Add a warning if exercises use type `calculation`
- Keep `Calculation.tsx` and its test file for now (dead code, no harm) -- can be deleted in a cleanup pass

### 4. Files created/modified

| File | Action |
|------|--------|
| `exercise-forms/TrueFalseForm.tsx` | Create |
| `exercise-forms/MultipleChoiceForm.tsx` | Create |
| `exercise-forms/FillInBlankForm.tsx` | Create |
| `exercise-forms/MatchingPairsForm.tsx` | Create |
| `exercise-forms/SequencingForm.tsx` | Create |
| `exercise-forms/GenericJsonForm.tsx` | Create |
| `exercise-forms/index.ts` | Create (barrel export) |
| `ExerciseEditor.tsx` | Rewrite to use sub-forms |
| `learning/types/learning.ts` | Remove `calculation` |
| `lesson/ExerciseRenderer.tsx` | Remove calculation case |
| `contentValidator.ts` | Warn on calculation type |

No backend or database changes required.

