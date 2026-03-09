import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus } from "lucide-react";

interface MCOption {
  id: string;
  text: string;
  text_es: string;
}

interface MCData {
  question: string;
  question_es: string;
  options: MCOption[];
  correct_answer: string;
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): MCData {
  const options = Array.isArray(raw.options)
    ? raw.options.map((o: any) => ({
        id: o.id ?? "",
        text: o.text ?? "",
        text_es: o.text_es ?? "",
      }))
    : [];
  return {
    question: raw.question ?? "",
    question_es: raw.question_es ?? "",
    options,
    correct_answer: raw.correct_answer ?? "",
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

function nextOptionId(options: MCOption[]): string {
  const nums = options
    .map((o) => parseInt(o.id.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  return `opt_${(nums.length ? Math.max(...nums) : 0) + 1}`;
}

export function MultipleChoiceForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<MCData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  const updateOption = (idx: number, patch: Partial<MCOption>) => {
    const next = d.options.map((o, i) => (i === idx ? { ...o, ...patch } : o));
    update({ options: next });
  };

  const addOption = () => {
    update({ options: [...d.options, { id: nextOptionId(d.options), text: "", text_es: "" }] });
  };

  const removeOption = (idx: number) => {
    const removed = d.options[idx];
    const next = d.options.filter((_, i) => i !== idx);
    const correctReset = removed.id === d.correct_answer ? "" : d.correct_answer;
    update({ options: next, correct_answer: correctReset });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question (EN)</Label>
        <Input value={d.question} onChange={(e) => update({ question: e.target.value })} placeholder="What is the most consumed beverage in the world?" />
      </div>

      <div className="space-y-2">
        <Label>Question (ES)</Label>
        <Input value={d.question_es} onChange={(e) => update({ question_es: e.target.value })} placeholder="¿Cuál es la bebida más consumida del mundo?" />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <Label>Options</Label>
        <RadioGroup value={d.correct_answer} onValueChange={(v) => update({ correct_answer: v })}>
          <div className="space-y-2">
            {d.options.map((opt, idx) => (
              <div key={opt.id || idx} className="flex items-start gap-2 rounded-lg border-4 border-border bg-card p-3">
                <div className="pt-2">
                  <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">{opt.id}</span>
                    <Input
                      value={opt.text}
                      onChange={(e) => updateOption(idx, { text: e.target.value })}
                      placeholder="Option text (EN)"
                      className="flex-1"
                    />
                  </div>
                  <Input
                    value={opt.text_es}
                    onChange={(e) => updateOption(idx, { text_es: e.target.value })}
                    placeholder="Option text (ES)"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 mt-1"
                  onClick={() => removeOption(idx)}
                  disabled={d.options.length <= 2}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </RadioGroup>
        <Button variant="outline" size="sm" onClick={addOption} disabled={d.options.length >= 5}>
          <Plus className="h-4 w-4 mr-1" /> Add Option
        </Button>
        {!d.correct_answer && d.options.length > 0 && (
          <p className="text-xs text-destructive">Select the correct answer</p>
        )}
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
