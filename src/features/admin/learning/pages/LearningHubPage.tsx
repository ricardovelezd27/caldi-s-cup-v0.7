import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTracks } from "../hooks/useAdminTracks";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toggleActive, deleteEntity } from "../services/adminLearningService";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import AdminBreadcrumb from "../components/AdminBreadcrumb";

export default function LearningHubPage() {
  const { data: tracks, isLoading } = useAdminTracks();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleToggle = async (id: string, current: boolean) => {
    await toggleActive("learning_tracks", id, !current);
    qc.invalidateQueries({ queryKey: ["admin", "tracks"] });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteEntity("learning_tracks", deleteTarget);
    qc.invalidateQueries({ queryKey: ["admin", "tracks"] });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <AdminBreadcrumb crumbs={[{ label: "Learning Hub" }]} />
      <h2 className="font-heading text-2xl">Learning Tracks</h2>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Track ID</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks?.map((t) => (
              <TableRow
                key={t.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/admin/learning/${t.id}`)}
              >
                <TableCell className="text-xl">{t.icon}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{t.track_id}</TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={t.is_active}
                    onCheckedChange={() => handleToggle(t.id, t.is_active)}
                  />
                </TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(t.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this track and all its nested content (sections, units, lessons, exercises).
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
