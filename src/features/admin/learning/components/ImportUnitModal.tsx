import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Upload } from "lucide-react";
import { validateUnitJson } from "../services/contentValidator";
import { transformUnitForDb } from "../services/contentTransformer";
import { upsertUnit, upsertLesson, upsertExercise, getAdminLessons, deleteExercisesByLessonId, deleteEntity } from "../services/adminLearningService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ImportUnit, ValidationResult } from "../types/adminTypes";
import { useQueryClient } from "@tanstack/react-query";

type Step = "paste" | "preview" | "done";

interface Props {
  open: boolean;
  onClose: () => void;
  sectionId: string;
  existingUnitCount: number;
}

export default function ImportUnitModal({ open, onClose, sectionId, existingUnitCount }: Props) {
  const [step, setStep] = useState<Step>("paste");
  const [rawJson, setRawJson] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string } | null>(null);
  const qc = useQueryClient();

  const handleParse = () => {
    const result = validateUnitJson(rawJson);
    setValidation(result);
    if (result.valid) setStep("preview");
  };

  const handlePublish = async () => {
    if (!validation?.data) return;
    setPublishing(true);
    try {
      const { unitRow, lessons } = transformUnitForDb(
        validation.data,
        sectionId,
        existingUnitCount,
      );

      const insertedUnit = await upsertUnit(unitRow);

      for (const { lessonRow, exercises } of lessons) {
        const insertedLesson = await upsertLesson({
          ...lessonRow,
          unit_id: insertedUnit.id,
        });

        for (const ex of exercises) {
          await upsertExercise({
            ...ex,
            lesson_id: insertedLesson.id,
          });
        }
      }

      setPublishResult({ success: true, message: `Published ${lessons.length} lessons successfully.` });
      setStep("done");
      qc.invalidateQueries({ queryKey: ["admin"] });
    } catch (err: any) {
      setPublishResult({ success: false, message: err.message ?? "Unknown error" });
      setStep("done");
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setStep("paste");
    setRawJson("");
    setValidation(null);
    setPublishResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Import Unit JSON</DialogTitle>
        </DialogHeader>

        {step === "paste" && (
          <div className="space-y-4">
            <Textarea
              value={rawJson}
              onChange={(e) => {
                setRawJson(e.target.value);
                setValidation(null);
              }}
              placeholder="Paste your AI-generated unit JSON here..."
              className="font-mono text-xs min-h-[300px]"
              spellCheck={false}
            />
            {validation && !validation.valid && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4 text-xs">
                    {validation.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleParse} disabled={!rawJson.trim()}>Parse & Preview</Button>
            </DialogFooter>
          </div>
        )}

        {step === "preview" && validation?.data && (
          <div className="space-y-4">
            {validation.warnings.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4 text-xs">
                    {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <StagedUnitPreview unit={validation.data} />

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("paste")}>Back</Button>
              <Button onClick={handlePublish} disabled={publishing}>
                <Upload className="h-4 w-4 mr-1" />
                {publishing ? "Publishing…" : "Publish to Database"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "done" && publishResult && (
          <div className="space-y-4">
            <Alert variant={publishResult.success ? "default" : "destructive"}>
              {publishResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>{publishResult.message}</AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Inline staged preview ──

function StagedUnitPreview({ unit }: { unit: ImportUnit }) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            {unit.icon} {unit.name}
            <span className="text-xs text-muted-foreground font-normal">/ {unit.name_es}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{unit.description}</CardContent>
      </Card>

      {unit.lessons.map((lesson, li) => (
        <Card key={li} className="ml-4">
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">
              Lesson {li + 1}: {lesson.name}
              <span className="text-xs text-muted-foreground ml-2">({lesson.exercises.length} exercises)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex flex-wrap gap-1">
              {lesson.exercises.map((ex, ei) => (
                <Badge key={ei} variant="outline" className="text-[10px]">
                  {ex.type} (D:{ex.difficulty})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
