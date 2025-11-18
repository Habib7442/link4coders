-- Enable public read access for active voice assistants
-- This allows the voice assistant button to show on public profiles without login

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to active voice assistants" ON ai_voice_assistants;

-- Create new policy that allows anyone to read active voice assistants
CREATE POLICY "Allow public read access to active voice assistants"
ON ai_voice_assistants
FOR SELECT
USING (is_active = true);

-- Verify RLS is enabled
ALTER TABLE ai_voice_assistants ENABLE ROW LEVEL SECURITY;
