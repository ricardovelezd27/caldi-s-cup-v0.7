
-- Delete any existing calculation exercises
DELETE FROM learning_exercises WHERE exercise_type = 'calculation';

-- Remove 'calculation' from the exercise_type enum
ALTER TYPE exercise_type RENAME TO exercise_type_old;
CREATE TYPE exercise_type AS ENUM (
  'multiple_choice','fill_in_blank','true_false',
  'matching_pairs','sequencing','image_identification',
  'categorization','troubleshooting','recipe_building',
  'prediction','comparison'
);
ALTER TABLE learning_exercises
  ALTER COLUMN exercise_type TYPE exercise_type
  USING exercise_type::text::exercise_type;
DROP TYPE exercise_type_old;
