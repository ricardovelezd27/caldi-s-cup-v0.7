import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  name_es: string;
}

interface Item {
  id: string;
  text: string;
  text_es: string;
  category_id: string;
}

interface CategorizationData {
  instruction: string;
  instruction_es: string;
  categories: Category[];
  items: Item[];
  explanation: string;
  explanation_es: string;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function toTyped(raw: Record<string, any>): CategorizationData {
  return {
    instruction: raw.instruction ?? "",
    instruction_es: raw.instruction_es ?? "",
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    items: Array.isArray(raw.items) ? raw.items : [],
    explanation: raw.explanation ?? "",
    explanation_es: raw.explanation_es ?? "",
  };
}

export function CategorizationForm({ data, onChange }: Props) {
  const d = toTyped(data);

  const update = (patch: Partial<CategorizationData>) => {
    onChange({ ...data, ...d, ...patch });
  };

  // Categories CRUD
  const addCategory = () => {
    const nextId = `cat_${d.categories.length + 1}`;
    update({ categories: [...d.categories, { id: nextId, name: "", name_es: "" }] });
  };

  const removeCategory = (idx: number) => {
    const removedId = d.categories[idx]?.id;
    const updatedItems = d.items.map((item) =>
      item.category_id === removedId ? { ...item, category_id: "" } : item,
    );
    update({
      categories: d.categories.filter((_, i) => i !== idx),
      items: updatedItems,
    });
  };

  const updateCategory = (idx: number, patch: Partial<Category>) => {
    const updated = d.categories.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    update({ categories: updated });
  };

  // Items CRUD
  const addItem = () => {
    const nextId = `item_${d.items.length + 1}`;
    update({ items: [...d.items, { id: nextId, text: "", text_es: "", category_id: "" }] });
  };

  const removeItem = (idx: number) => {
    update({ items: d.items.filter((_, i) => i !== idx) });
  };

  const updateItem = (idx: number, patch: Partial<Item>) => {
    const updated = d.items.map((item, i) => (i === idx ? { ...item, ...patch } : item));
    update({ items: updated });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Instruction (EN)</Label>
        <Input value={d.instruction} onChange={(e) => update({ instruction: e.target.value })} placeholder="Sort these items into the correct category." />
      </div>
      <div className="space-y-2">
        <Label>Instruction (ES)</Label>
        <Input value={d.instruction_es} onChange={(e) => update({ instruction_es: e.target.value })} />
      </div>

      {/* Categories */}
      <div className="border-t-4 border-border pt-4 space-y-3">
        <Label className="text-base font-heading">Categories</Label>
        {d.categories.map((cat, idx) => (
          <div key={cat.id} className="flex items-start gap-2 rounded-lg border-4 border-border bg-card p-3">
            <div className="flex-1 space-y-2">
              <span className="text-xs text-muted-foreground font-mono">{cat.id}</span>
              <Input value={cat.name} onChange={(e) => updateCategory(idx, { name: e.target.value })} placeholder={`Category ${idx + 1} (EN)`} />
              <Input value={cat.name_es} onChange={(e) => updateCategory(idx, { name_es: e.target.value })} placeholder={`Category ${idx + 1} (ES)`} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeCategory(idx)} className="text-destructive mt-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addCategory}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {/* Items */}
      <div className="border-t-4 border-border pt-4 space-y-3">
        <Label className="text-base font-heading">Items</Label>
        {d.items.map((item, idx) => (
          <div key={item.id} className="flex items-start gap-2 rounded-lg border-4 border-border bg-card p-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                <Select value={item.category_id} onValueChange={(v) => updateItem(idx, { category_id: v })}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Assign category" />
                  </SelectTrigger>
                  <SelectContent>
                    {d.categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name || cat.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input value={item.text} onChange={(e) => updateItem(idx, { text: e.target.value })} placeholder={`Item ${idx + 1} (EN)`} />
              <Input value={item.text_es} onChange={(e) => updateItem(idx, { text_es: e.target.value })} placeholder={`Item ${idx + 1} (ES)`} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-destructive mt-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" /> Add Item
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
