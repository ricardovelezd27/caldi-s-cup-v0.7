import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  error: string;
  onError: (msg: string) => void;
}

export function GenericJsonForm({ data, onChange, error, onError }: Props) {
  const [jsonStr, setJsonStr] = useState(JSON.stringify(data, null, 2));

  const handleChange = (value: string) => {
    setJsonStr(value);
    onError("");
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
    } catch {
      onError("Invalid JSON");
    }
  };

  return (
    <div className="space-y-2">
      <Label>question_data (JSON)</Label>
      <Textarea
        value={jsonStr}
        onChange={(e) => handleChange(e.target.value)}
        className="font-mono text-xs min-h-[200px]"
        spellCheck={false}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">This exercise type uses raw JSON editing. A dedicated form will be added in a future update.</p>
    </div>
  );
}
