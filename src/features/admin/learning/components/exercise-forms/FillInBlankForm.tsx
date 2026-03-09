import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Blank {
  id: string;
  correct_answers: string[];
}

interface FIBData {
  question: string;
  question_es: string;
  blanks: Blank[];
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): FIBData {
  const blanks = Array.isArray(raw.blanks)
    ? raw.blanks.map((b: any) => ({
        id: b.id ?? "",
        correct_answers: Array.isArray(b.correct_answers) ? b.correct_answers : [],
      }))
    : [];
  return {
    question: raw.question ?? "",
    question_es: raw.question_es ?? "",
    blanks,
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function FillInBlankForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<FIBData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  const updateBlank = (idx: number, answers: string) => {
    const next = d.blanks.map((b, i) =>
      i === idx ? { ...b, correct_answers: answers.split(",").map((s) => s.trim()).filter(Boolean) } : b,
    );
    update({ blanks: next });
  };

  const addBlank = () => {
    const id = `blank_${d.blanks.length + 1}`;
    update({ blanks: [...d.blanks, { id, correct_answers: [] }] });
  };

  const removeBlank = (idx: number) => {
    update({ blanks: d.blanks.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question with &#123;blank&#125; tokens (EN)</Label>
        <Input value={d.question} onChange={(e) => update({ question: e.target.value })} placeholder="Coffee beans are actually the {blank} of the coffee plant." />
        <p className="text-xs text-muted-foreground">Use &#123;blank&#125; to mark blanks in the text.</p>
      </div>

      <div className="space-y-2">
        <Label>Question (ES)</Label>
        <Input value={d.question_es} onChange={(e) => update({ question_es: e.target.value })} placeholder="Los granos de café son en realidad las {blank} de la planta." />
      </div>

      <div className="space-y-2">
        <Label>Blanks</Label>
        {d.blanks.map((blank, idx) => (
          <div key={blank.id || idx} className="flex items-center gap-2 rounded-lg border-4 border-border bg-card p-3">
            <span className="text-xs font-mono text-muted-foreground w-16 shrink-0">{blank.id}</span>
            <Input
              value={blank.correct_answers.join(", ")}
              onChange={(e) => updateBlank(idx, e.target.value)}
              placeholder="Accepted answers (comma-separated)"
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => removeBlank(idx)} disabled={d.blanks.length <= 1}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addBlank}>
          <Plus className="h-4 w-4 mr-1" /> Add Blank
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
