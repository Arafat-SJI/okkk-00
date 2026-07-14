/**
 * Composition example â small pieces composed into a feature.
 * Prefer this over one giant component with many boolean props.
 */

import { Inbox, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";

import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DemoItem = {
  id: string;
  title: string;
  status: "open" | "done";
};

/* âââ atomic pieces âââ */

type ToolbarProps = {
  search: ReactNode;
  actions: ReactNode;
  className?: string;
};

function Toolbar({ search, actions, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0 flex-1">{search}</div>
      <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
    </div>
  );
}

type ItemCardProps = {
  item: DemoItem;
  trailing?: ReactNode;
  onToggle?: (id: string) => void;
};

function ItemCard({ item, trailing, onToggle }: ItemCardProps) {
  return (
    <li>
      <Card className="transition-colors hover:bg-muted/40">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
          <div className="space-y-1">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription className="capitalize">{item.status}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onToggle ? (
              <Button type="button" variant="outline" size="sm" onClick={() => onToggle(item.id)}>
                {item.status === "open" ? "Complete" : "Reopen"}
              </Button>
            ) : null}
            {trailing}
          </div>
        </CardHeader>
      </Card>
    </li>
  );
}

type ItemListProps = {
  items: DemoItem[];
  renderItem: (item: DemoItem) => ReactNode;
  empty: ReactNode;
};

function ItemList({ items, renderItem, empty }: ItemListProps) {
  if (items.length === 0) return <>{empty}</>;
  return <ul className="flex flex-col gap-3">{items.map(renderItem)}</ul>;
}

/* âââ composed feature âââ */

type ExampleFeatureProps = {
  /** Optional slot above the list (filters, banners, etc.) */
  banner?: ReactNode;
  initialItems?: DemoItem[];
};

const DEFAULT_ITEMS: DemoItem[] = [
  { id: "1", title: "Compose layouts with children, not inheritance", status: "done" },
  { id: "2", title: "Split features into Toolbar + List + EmptyState", status: "open" },
  { id: "3", title: "Pass ReactNode slots for actions and empty CTAs", status: "open" },
];

/**
 * Full feature assembled from small composable parts.
 * Pages should import this (or similar) â not reinvent list/empty/toolbar.
 */
export function ExampleFeature({ banner, initialItems = DEFAULT_ITEMS }: ExampleFeatureProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(initialItems);

  const filtered = items.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()));

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "open" ? "done" : "open" } : item,
      ),
    );
  };

  const addItem = () => {
    const title = query.trim() || `New item ${items.length + 1}`;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), title, status: "open" }]);
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-6">
      {banner}

      <Toolbar
        search={
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter or type a new titleâ¦"
            aria-label="Filter items"
          />
        }
        actions={
          <>
            <Button type="button" onClick={addItem}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </>
        }
      />

      <ItemList
        items={filtered}
        renderItem={(item) => <ItemCard key={item.id} item={item} onToggle={toggle} />}
        empty={
          <EmptyState
            icon={<Inbox className="h-8 w-8" />}
            title="No items match"
            description="Clear the filter or add a new item."
            action={
              <Button type="button" variant="secondary" onClick={addItem}>
                Add item
              </Button>
            }
          />
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why this pattern</CardTitle>
          <CardDescription>
            Toolbar, ItemList, ItemCard, and EmptyState stay small and reusable. The page only
            composes them â no mega-component with <code>showSearch</code> / <code>showEmpty</code>{" "}
            flags.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Children / slots</strong> for actions & empty CTA
            </li>
            <li>
              <strong className="text-foreground">renderItem</strong> to customize rows without
              forking the list
            </li>
            <li>
              <strong className="text-foreground">Compound layouts</strong> via{" "}
              <code>PageLayout.*</code>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
