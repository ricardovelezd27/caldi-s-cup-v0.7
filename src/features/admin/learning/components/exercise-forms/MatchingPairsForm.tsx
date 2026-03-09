import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Pair {
  id: string;
  left: string;
  left_es: string;
  right: string;
  right_es: string;
}

interface MPData {
  instruction: string;
  instruction_es: string;
  pairs: Pair[];
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): MPData {
  const pairs = Array.isArray(raw.pairs)
    ? raw.pairs.map((p: any) => ({
        id: p.id ?? "",
        left: p.left ?? "",
        left_es: p.left_es ?? "",
        right: p.right ?? "",
        right_es: p.right_es ?? "",
      }))
    : [];
  return {
    instruction: raw.instruction ?? "",
    instruction_es: raw.instruction_es ?? "",
    pairs,
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function MatchingPairsForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<MPData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  const updatePair = (idx: number, patch: Partial<Pair>) => {
    const next = d.pairs.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    update({ pairs: next });
  };

  const addPair = () => {
    update({ pairs: [...d.pairs, { id: `pair_${d.pairs.length + 1}`, left: "", left_es: "", right: "", right_es: "" }] });
  };

  const removePair = (idx: number) => {
    update({ pairs: d.pairs.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Instruction (EN)</Label>
        <Input value={d.instruction} onChange={(e) => update({ instruction: e.target.value })} placeholder="Match the country to its famous coffee region." />
      </div>

      <div className="space-y-2">
        <Label>Instruction (ES)</Label>
        <Input value={d.instruction_es} onChange={(e) => update({ instruction_es: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Pairs</Label>
        {d.pairs.map((pair, idx) => (
          <div key={pair.id || idx} className="rounded-lg border-4 border-border bg-card p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-14 shrink-0">{pair.id}</span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => removePair(idx)} disabled={d.pairs.length <= 2}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={pair.left} onChange={(e) => updatePair(idx, { left: e.target.value })} placeholder="Left (EN)" />
              <Input value={pair.right} onChange={(e) => updatePair(idx, { right: e.target.value })} placeholder="Right (EN)" />
              <Input value={pair.left_es} onChange={(e) => updatePair(idx, { left_es: e.target.value })} placeholder="Left (ES)" />
              <Input value={pair.right_es} onChange={(e) => updatePair(idx, { right_es: e.target.value })} placeholder="Right (ES)" />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addPair}>
          <Plus className="h-4 w-4 mr-1" /> Add Pair
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Explanation (EN)</Label>
        <Input value={d.explanation} onChange={(e) => update({ explanation: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Explanation (ES)</Label>
        <Input value={d.explanation_es} onChange={(e) => update({ explanation_es: e.target.value })} />
      </div>
    </div>
  );
}
