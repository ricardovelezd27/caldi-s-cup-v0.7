import { useLanguage } from "@/contexts/language";
import type { LearningExercise } from "../../types";
import { MultipleChoice } from "../exercises/knowledge/MultipleChoice";
import { TrueFalse } from "../exercises/knowledge/TrueFalse";
import { FillInBlank } from "../exercises/knowledge/FillInBlank";
import { MatchingPairs } from "../exercises/knowledge/MatchingPairs";
import { Sequencing } from "../exercises/knowledge/Sequencing";
import { ImageIdentification } from "../exercises/knowledge/ImageIdentification";
import { Categorization } from "../exercises/knowledge/Categorization";
import { Troubleshooting } from "../exercises/applied/Troubleshooting";
import { RecipeBuilding } from "../exercises/applied/RecipeBuilding";
import { Prediction } from "../exercises/applied/Prediction";
import { Comparison } from "../exercises/applied/Comparison";

interface ExerciseRendererProps {
  exercise: LearningExercise;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled: boolean;
}

export function ExerciseRenderer({ exercise, onAnswer, disabled }: ExerciseRendererProps) {
  const qd = exercise.questionData as any;

  const handleSubmit = (answer: any, isCorrect: boolean) => {
    onAnswer(answer, isCorrect);
  };

  switch (exercise.exerciseType) {
    case "multiple_choice":
      return <MultipleChoice data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "true_false":
      return <TrueFalse data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "fill_in_blank":
      return <FillInBlank data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "matching_pairs":
      return <MatchingPairs data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "sequencing":
      return <Sequencing data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "image_identification":
      return <ImageIdentification data={qd} imageUrl={exercise.imageUrl} onSubmit={handleSubmit} disabled={disabled} />;
    case "categorization":
      return <Categorization data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "troubleshooting":
      return <Troubleshooting data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "recipe_building":
      return <RecipeBuilding data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "calculation":
      return <Calculation data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "prediction":
      return <Prediction data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    case "comparison":
      return <Comparison data={qd} onSubmit={handleSubmit} disabled={disabled} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="rounded-lg border-4 border-dashed border-border p-8 bg-card/50 max-w-sm w-full">
            <p className="text-muted-foreground font-inter text-sm">
              Unknown exercise type: {exercise.exerciseType}
            </p>
          </div>
        </div>
      );
  }
}
