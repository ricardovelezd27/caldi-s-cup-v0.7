import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TrueFalseData {
  statement: string;
  statement_es: string;
  correct_answer: boolean;
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): TrueFalseData {
  return {
    statement: raw.statement ?? "",
    statement_es: raw.statement_es ?? "",
    correct_answer: raw.correct_answer ?? true,
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function TrueFalseForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<TrueFalseData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Statement (EN)</Label>
        <Input value={d.statement} onChange={(e) => update({ statement: e.target.value })} placeholder="Coffee was first discovered in Ethiopia." />
      </div>

      <div className="space-y-2">
        <Label>Statement (ES)</Label>
        <Input value={d.statement_es} onChange={(e) => update({ statement_es: e.target.value })} placeholder="El café fue descubierto por primera vez en Etiopía." />
      </div>

      <div className="flex items-center gap-3 rounded-lg border-4 border-border bg-card p-4">
        <Label className="flex-1">Correct Answer</Label>
        <span className="text-sm font-medium text-muted-foreground">{d.correct_answer ? "True ✅" : "False ❌"}</span>
        <Switch checked={d.correct_answer} onCheckedChange={(v) => update({ correct_answer: v })} />
      </div>

      <div className="space-y-2">
        <Label>Explanation (EN)</Label>
        <Input value={d.explanation} onChange={(e) => update({ explanation: e.target.value })} placeholder="According to legend, a goat herder named Kaldi…" />
      </div>

      <div className="space-y-2">
        <Label>Explanation (ES)</Label>
        <Input value={d.explanation_es} onChange={(e) => update({ explanation_es: e.target.value })} placeholder="Según la leyenda, un pastor de cabras llamado Kaldi…" />
      </div>
    </div>
  );
}
