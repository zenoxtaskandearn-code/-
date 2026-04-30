-- Migration: Add screenshot proof and review status to task completions

ALTER TABLE task_completions
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
  CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED')),
ADD COLUMN IF NOT EXISTS admin_note VARCHAR(200),
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Add composite index for admin review queue
CREATE INDEX IF NOT EXISTS idx_task_completions_review_status ON task_completions(review_status);
