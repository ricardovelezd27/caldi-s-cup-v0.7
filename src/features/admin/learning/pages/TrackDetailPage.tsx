import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminTrackById, toggleActive, deleteEntity, exportTrackFull } from "../services/adminLearningService";
import { useAdminSections, useAdminUnitsForSections } from "../hooks/useAdminSections";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronDown, Upload, Trash2, Download } from "lucide-react";
import AdminBreadcrumb from "../components/AdminBreadcrumb";
import ImportUnitModal from "../components/ImportUnitModal";

export default function TrackDetailPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [importSection, setImportSection] = useState<{ sectionId: string; unitCount: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!trackId) return;
    setExporting(true);
    try {
      const data = await exportTrackFull(trackId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `track-${(data.name ?? "export").toLowerCase().replace(/\s+/g, "-")}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExporting(false);
    }
  };

  const { data: track } = useQuery({
    queryKey: ["admin", "track", trackId],
    queryFn: () => getAdminTrackById(trackId!),
    enabled: !!trackId,
  });

  const { data: sections, isLoading: sectionsLoading } = useAdminSections(trackId);
  const sectionIds = sections?.map((s) => s.id) ?? [];
  const { data: allUnits } = useAdminUnitsForSections(sectionIds);

  const handleToggleUnit = async (id: string, current: boolean) => {
    await toggleActive("learning_units", id, !current);
    qc.invalidateQueries({ queryKey: ["admin", "units-by-sections"] });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteEntity("learning_units", deleteTarget);
    qc.invalidateQueries({ queryKey: ["admin", "units-by-sections"] });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <AdminBreadcrumb
        crumbs={[
          { label: "Learning Hub", href: "/admin/learning" },
          { label: track?.name ?? "Track" },
        ]}
      />

      {track && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl flex items-center gap-2">
              <span>{track.icon}</span> {track.name}
            </h2>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
              <Download className="h-3 w-3 mr-1" />
              {exporting ? "Exporting…" : "Export Track JSON"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{track.description}</p>
        </div>
      )}

      {sectionsLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        sections?.map((section) => {
          const units = allUnits?.filter((u) => u.section_id === section.id) ?? [];
          return (
            <Collapsible key={section.id} defaultOpen>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-heading flex items-center gap-2">
                        {section.name}
                        <Badge variant="outline" className="text-xs">{section.level}</Badge>
                        {!section.is_active && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{section.learning_goal}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setImportSection({ sectionId: section.id, unitCount: units.length })}
                      >
                        <Upload className="h-3 w-3 mr-1" /> Import Unit JSON
                      </Button>
                    </div>
                    {units.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No units in this section.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Unit Name</TableHead>
                            <TableHead className="text-center">Lessons</TableHead>
                            <TableHead className="text-center">Time</TableHead>
                            <TableHead className="text-center">Active</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {units.map((u) => (
                            <TableRow
                              key={u.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => navigate(`/admin/learning/${trackId}/${u.id}`)}
                            >
                              <TableCell>{u.icon}</TableCell>
                              <TableCell className="font-medium">{u.name}</TableCell>
                              <TableCell className="text-center">{u.lesson_count}</TableCell>
                              <TableCell className="text-center">{u.estimated_minutes}m</TableCell>
                              <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                <Switch
                                  checked={u.is_active}
                                  onCheckedChange={() => handleToggleUnit(u.id, u.is_active)}
                                />
                              </TableCell>
                              <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(u.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })
      )}

      {importSection && (
        <ImportUnitModal
          open={!!importSection}
          onClose={() => setImportSection(null)}
          sectionId={importSection.sectionId}
          existingUnitCount={importSection.unitCount}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this unit and all its nested content (lessons and exercises).
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
