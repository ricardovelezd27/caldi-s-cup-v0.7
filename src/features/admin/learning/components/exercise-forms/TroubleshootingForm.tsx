import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";

interface Option {
  id: string;
  text: string;
  text_es: string;
  is_correct: boolean;
}

interface TroubleshootingData {
  scenario: string;
  scenario_es: string;
  question: string;
  question_es: string;
  options: Option[];
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): TroubleshootingData {
  return {
    scenario: raw.scenario ?? "",
    scenario_es: raw.scenario_es ?? "",
    question: raw.question ?? "",
    question_es: raw.question_es ?? "",
    options: Array.isArray(raw.options)
      ? raw.options.map((o: any) => ({ id: o.id ?? "", text: o.text ?? "", text_es: o.text_es ?? "", is_correct: !!o.is_correct }))
      : [],
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function TroubleshootingForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<TroubleshootingData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  const addOption = () => {
    const nextId = `opt_${d.options.length + 1}`;
    update({ options: [...d.options, { id: nextId, text: "", text_es: "", is_correct: false }] });
  };

  const removeOption = (idx: number) => {
    update({ options: d.options.filter((_, i) => i !== idx) });
  };

  const updateOption = (idx: number, patch: Partial<Option>) => {
    const updated = d.options.map((o, i) => (i === idx ? { ...o, ...patch } : o));
    update({ options: updated });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Scenario (EN)</Label>
        <Input value={d.scenario} onChange={(e) => update({ scenario: e.target.value })} placeholder="Your pour-over tastes sour and watery…" />
      </div>
      <div className="space-y-2">
        <Label>Scenario (ES)</Label>
        <Input value={d.scenario_es} onChange={(e) => update({ scenario_es: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Question (EN)</Label>
        <Input value={d.question} onChange={(e) => update({ question: e.target.value })} placeholder="What is the most likely cause?" />
      </div>
      <div className="space-y-2">
        <Label>Question (ES)</Label>
        <Input value={d.question_es} onChange={(e) => update({ question_es: e.target.value })} />
      </div>

      {/* Options with is_correct toggle */}
      <div className="border-t-4 border-border pt-4 space-y-3">
        <Label className="text-base font-heading">Options</Label>
        {d.options.map((opt, idx) => (
          <div key={opt.id} className="flex items-start gap-2 rounded-lg border-4 border-border bg-card p-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{opt.id}</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-xs text-muted-foreground">{opt.is_correct ? "Correct ✅" : "Incorrect"}</span>
                  <Switch checked={opt.is_correct} onCheckedChange={(v) => updateOption(idx, { is_correct: v })} />
                </div>
              </div>
              <Input value={opt.text} onChange={(e) => updateOption(idx, { text: e.target.value })} placeholder={`Option ${idx + 1} (EN)`} />
              <Input value={opt.text_es} onChange={(e) => updateOption(idx, { text_es: e.target.value })} placeholder={`Option ${idx + 1} (ES)`} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)} className="text-destructive mt-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="h-4 w-4 mr-1" /> Add Option
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
