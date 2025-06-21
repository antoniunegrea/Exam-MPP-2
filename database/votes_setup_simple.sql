-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- Only one vote allowed per user total
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);

-- Create vote statistics view
CREATE OR REPLACE VIEW vote_statistics AS
SELECT 
  c.id as candidate_id,
  c.name as candidate_name,
  COUNT(v.id) as vote_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM votes) > 0 
    THEN ROUND((COUNT(v.id)::DECIMAL / (SELECT COUNT(*) FROM votes) * 100), 2)
    ELSE 0 
  END as percentage
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
GROUP BY c.id, c.name
ORDER BY vote_count DESC;

-- Grant necessary permissions (adjust as needed for your setup)
GRANT ALL PRIVILEGES ON TABLE votes TO postgres;
GRANT ALL PRIVILEGES ON TABLE votes TO anon;
GRANT ALL PRIVILEGES ON TABLE votes TO authenticated;
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- Grant permissions on the view
GRANT ALL PRIVILEGES ON vote_statistics TO postgres;
GRANT ALL PRIVILEGES ON vote_statistics TO anon;
GRANT ALL PRIVILEGES ON vote_statistics TO authenticated;
GRANT ALL PRIVILEGES ON vote_statistics TO service_role;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role; 