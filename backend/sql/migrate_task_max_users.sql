ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS max_users INTEGER NOT NULL DEFAULT 0
  CHECK (max_users >= 0);

CREATE INDEX IF NOT EXISTS idx_task_completions_task_id_status
  ON task_completions (task_id, status);
