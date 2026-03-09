import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminTrackById, getAdminUnitById, getAdminLessonById, toggleActive, updateExercise, deleteEntity } from "../services/adminLearningService";
import { useAdminExercises } from "../hooks/useAdminExercises";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import AdminBreadcrumb from "../components/AdminBreadcrumb";
import ExerciseEditor from "../components/ExerciseEditor";
import type { AdminExerciseRow } from "../services/adminLearningService";

export default function LessonDetailPage() {
  const { trackId, unitId, lessonId } = useParams<{
    trackId: string;
    unitId: string;
    lessonId: string;
  }>();
  const qc = useQueryClient();
  const [editingExercise, setEditingExercise] = useState<AdminExerciseRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: track } = useQuery({
    queryKey: ["admin", "track", trackId],
    queryFn: () => getAdminTrackById(trackId!),
    enabled: !!trackId,
  });

  const { data: unit } = useQuery({
    queryKey: ["admin", "unit", unitId],
    queryFn: () => getAdminUnitById(unitId!),
    enabled: !!unitId,
  });

  const { data: lesson } = useQuery({
    queryKey: ["admin", "lesson", lessonId],
    queryFn: () => getAdminLessonById(lessonId!),
    enabled: !!lessonId,
  });

  const { data: exercises, isLoading } = useAdminExercises(lessonId);

  const handleToggle = async (id: string, current: boolean) => {
    await toggleActive("learning_exercises", id, !current);
    qc.invalidateQueries({ queryKey: ["admin", "exercises"] });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteEntity("learning_exercises", deleteTarget);
    qc.invalidateQueries({ queryKey: ["admin", "exercises"] });
    setDeleteTarget(null);
  };

  const getQuestionPreview = (qd: any): string => {
    if (!qd) return "—";
    return (
      qd.question || qd.statement || qd.scenario || qd.instruction || "—"
    ).slice(0, 80);
  };

  return (
    <div className="space-y-4">
      <AdminBreadcrumb
        crumbs={[
          { label: "Learning Hub", href: "/admin/learning" },
          { label: track?.name ?? "Track", href: `/admin/learning/${trackId}` },
          { label: unit?.name ?? "Unit", href: `/admin/learning/${trackId}/${unitId}` },
          { label: lesson?.name ?? "Lesson" },
        ]}
      />

      {lesson && (
        <div className="space-y-1">
          <h2 className="font-heading text-2xl">{lesson.name}</h2>
          <p className="text-sm text-muted-foreground">{lesson.intro_text}</p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>XP: {lesson.xp_reward}</span>
            <span>Exercises: {lesson.exercise_count}</span>
            <span>~{lesson.estimated_minutes}m</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="grid gap-3">
          {exercises?.map((ex, i) => (
            <Card key={ex.id} className={!ex.is_active ? "opacity-60" : ""}>
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <Badge variant="outline">{ex.exercise_type}</Badge>
                  <span className="text-xs">{ex.mascot} ({ex.mascot_mood})</span>
                  <Badge variant="secondary" className="text-xs">D:{ex.difficulty_score}</Badge>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={ex.is_active}
                    onCheckedChange={() => handleToggle(ex.id, ex.is_active)}
                  />
                  <Button size="sm" variant="outline" onClick={() => setEditingExercise(ex)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(ex.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground truncate">
                  {getQuestionPreview(ex.question_data)}
                </p>
                {ex.concept_tags.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {ex.concept_tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingExercise && (
        <ExerciseEditor
          exercise={editingExercise}
          open={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          onSave={async (updates) => {
            await updateExercise(editingExercise.id, updates);
            qc.invalidateQueries({ queryKey: ["admin", "exercises"] });
            setEditingExercise(null);
          }}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this exercise.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
