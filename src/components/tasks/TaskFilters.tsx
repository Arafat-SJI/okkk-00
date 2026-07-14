import React from "react";

type Props = {
  q: string;
  onSearch: (val: string) => void;
  status?: string | null;
  priority?: string | null;
  onStatusChange: (val: string | null) => void;
  onPriorityChange: (val: string | null) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
};

export function TaskFilters({ q, onSearch, status, priority, onStatusChange, onPriorityChange, sortBy, onSortChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks..."
          className="rounded border p-2"
          aria-label="Search tasks"
        />
        <select value={status ?? ""} onChange={(e) => onStatusChange(e.target.value || null)} className="rounded border p-2">
          <option value="">All status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={priority ?? ""} onChange={(e) => onPriorityChange(e.target.value || null)} className="rounded border p-2">
          <option value="">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Sort</label>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="rounded border p-2">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="due_date">Due date</option>
        </select>
      </div>
    </div>
  );
}
