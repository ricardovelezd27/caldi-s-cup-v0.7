import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus } from "lucide-react";

interface Option {
  id: string;
  text: string;
  text_es: string;
}

interface PredictionData {
  scenario: string;
  scenario_es: string;
  question: string;
  question_es: string;
  options: Option[];
  correct_answer: string;
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): PredictionData {
  return {
    scenario: raw.scenario ?? "",
    scenario_es: raw.scenario_es ?? "",
    question: raw.question ?? "",
    question_es: raw.question_es ?? "",
    options: Array.isArray(raw.options) ? raw.options : [],
    correct_answer: raw.correct_answer ?? "",
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function PredictionForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<PredictionData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  const addOption = () => {
    const nextId = `opt_${d.options.length + 1}`;
    update({ options: [...d.options, { id: nextId, text: "", text_es: "" }] });
  };

  const removeOption = (idx: number) => {
    const updated = d.options.filter((_, i) => i !== idx);
    const removedId = d.options[idx]?.id;
    update({
      options: updated,
      correct_answer: d.correct_answer === removedId ? "" : d.correct_answer,
    });
  };

  const updateOption = (idx: number, patch: Partial<Option>) => {
    const updated = d.options.map((o, i) => (i === idx ? { ...o, ...patch } : o));
    update({ options: updated });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Scenario (EN)</Label>
        <Input value={d.scenario} onChange={(e) => update({ scenario: e.target.value })} placeholder="A barista notices their espresso is running too fast…" />
      </div>
      <div className="space-y-2">
        <Label>Scenario (ES)</Label>
        <Input value={d.scenario_es} onChange={(e) => update({ scenario_es: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Question (EN)</Label>
        <Input value={d.question} onChange={(e) => update({ question: e.target.value })} placeholder="What will happen if they grind finer?" />
      </div>
      <div className="space-y-2">
        <Label>Question (ES)</Label>
        <Input value={d.question_es} onChange={(e) => update({ question_es: e.target.value })} />
      </div>

      {/* Options */}
      <div className="border-t-4 border-border pt-4 space-y-3">
        <Label className="text-base font-heading">Options</Label>
        <RadioGroup value={d.correct_answer} onValueChange={(v) => update({ correct_answer: v })}>
          {d.options.map((opt, idx) => (
            <div key={opt.id} className="flex items-start gap-2 rounded-lg border-4 border-border bg-card p-3">
              <RadioGroupItem value={opt.id} id={`pred-opt-${opt.id}`} className="mt-2.5" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">{opt.id}</span>
                  {d.correct_answer === opt.id && <span className="text-xs text-secondary font-bold">✓ Correct</span>}
                </div>
                <Input value={opt.text} onChange={(e) => updateOption(idx, { text: e.target.value })} placeholder={`Option ${idx + 1} (EN)`} />
                <Input value={opt.text_es} onChange={(e) => updateOption(idx, { text_es: e.target.value })} placeholder={`Option ${idx + 1} (ES)`} />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)} className="text-destructive mt-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
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
