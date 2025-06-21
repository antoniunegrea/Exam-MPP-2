-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, candidate_id) -- Prevent multiple votes from same user for same candidate
);

-- Enable Row Level Security
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for votes
-- Users can only see their own votes
CREATE POLICY "Users can view their own votes" ON votes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own votes
CREATE POLICY "Users can insert their own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users cannot update or delete votes (votes are permanent)
CREATE POLICY "No updates or deletes on votes" ON votes
  FOR ALL USING (false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_candidate ON votes(user_id, candidate_id);

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

-- Create function to get user's voting history
CREATE OR REPLACE FUNCTION get_user_votes(user_cnp VARCHAR(13))
RETURNS TABLE (
  vote_id INTEGER,
  candidate_id INTEGER,
  candidate_name VARCHAR(255),
  candidate_party party_type,
  voted_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.candidate_id,
    c.name,
    c.party,
    v.created_at
  FROM votes v
  JOIN candidates c ON v.candidate_id = c.id
  JOIN users u ON v.user_id = u.id
  WHERE u.cnp = user_cnp
  ORDER BY v.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user voted for a specific candidate
CREATE OR REPLACE FUNCTION has_user_voted(user_cnp VARCHAR(13), candidate_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  vote_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM votes v
    JOIN users u ON v.user_id = u.id
    WHERE u.cnp = user_cnp AND v.candidate_id = candidate_id_param
  ) INTO vote_exists;
  
  RETURN vote_exists;
END;
$$ LANGUAGE plpgsql;

-- Create function to get total votes count
CREATE OR REPLACE FUNCTION get_total_votes()
RETURNS INTEGER AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM votes;
  RETURN total_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get candidate vote count
CREATE OR REPLACE FUNCTION get_candidate_vote_count(candidate_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  vote_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vote_count 
  FROM votes 
  WHERE candidate_id = candidate_id_param;
  
  RETURN vote_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample votes (optional - for testing)
-- INSERT INTO votes (user_id, candidate_id) VALUES 
--   (1, 1),
--   (1, 2),
--   (2, 1),
--   (3, 3);

-- Create a trigger to update vote statistics when votes are added/removed
CREATE OR REPLACE FUNCTION update_vote_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to update any cached statistics
  -- For now, we'll use the view which updates automatically
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vote_statistics
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_statistics(); 