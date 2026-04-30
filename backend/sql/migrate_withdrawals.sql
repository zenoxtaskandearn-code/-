-- Make screenshot_url nullable for withdrawal requests
ALTER TABLE withdrawal_requests ALTER COLUMN screenshot_url DROP NOT NULL;
