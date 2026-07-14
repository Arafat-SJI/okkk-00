export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string | null;
  user_id: string;
  created_at: string;
  updated_at?: string;
};

export type TaskInsert = {
  title: string;
  description?: string | null;
  status?: Task["status"];
  priority?: Task["priority"];
  due_date?: string | null;
  user_id: string;
};

export type TaskUpdate = Partial<TaskInsert>;

export type Profile = {
  id: string;
  name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
};
