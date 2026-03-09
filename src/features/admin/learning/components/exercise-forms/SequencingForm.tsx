import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface SeqItem {
  id: string;
  text: string;
  text_es: string;
}

interface SeqData {
  instruction: string;
  instruction_es: string;
  items: SeqItem[];
  correct_order: string[];
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): SeqData {
  const items = Array.isArray(raw.items)
    ? raw.items.map((it: any) => ({ id: it.id ?? "", text: it.text ?? "", text_es: it.text_es ?? "" }))
    : [];
  return {
    instruction: raw.instruction ?? "",
    instruction_es: raw.instruction_es ?? "",
    items,
    correct_order: Array.isArray(raw.correct_order) ? raw.correct_order : items.map((it: SeqItem) => it.id),
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function SequencingForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<SeqData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  const updateItem = (idx: number, patch: Partial<SeqItem>) => {
    const next = d.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    update({ items: next, correct_order: next.map((it) => it.id) });
  };

  const addItem = () => {
    const newItem: SeqItem = { id: `step_${d.items.length + 1}`, text: "", text_es: "" };
    const next = [...d.items, newItem];
    update({ items: next, correct_order: next.map((it) => it.id) });
  };

  const removeItem = (idx: number) => {
    const next = d.items.filter((_, i) => i !== idx);
    update({ items: next, correct_order: next.map((it) => it.id) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Instruction (EN)</Label>
        <Input value={d.instruction} onChange={(e) => update({ instruction: e.target.value })} placeholder="Put these steps in the correct order." />
      </div>

      <div className="space-y-2">
        <Label>Instruction (ES)</Label>
        <Input value={d.instruction_es} onChange={(e) => update({ instruction_es: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Items (listed in correct order)</Label>
        {d.items.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center gap-2 rounded-lg border-4 border-border bg-card p-3">
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">{idx + 1}</span>
            <div className="flex-1 space-y-1">
              <Input value={item.text} onChange={(e) => updateItem(idx, { text: e.target.value })} placeholder="Step text (EN)" />
              <Input value={item.text_es} onChange={(e) => updateItem(idx, { text_es: e.target.value })} placeholder="Step text (ES)" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} disabled={d.items.length <= 2}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" /> Add Step
        </Button>
        <p className="text-xs text-muted-foreground">The order shown here IS the correct order. Rearrange by editing.</p>
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
