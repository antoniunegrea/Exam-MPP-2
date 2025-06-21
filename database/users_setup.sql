-- Create users table for CNP-based authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  cnp VARCHAR(13) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for user operations
-- Allow anyone to register (insert)
CREATE POLICY "Allow register by CNP" ON users
  FOR INSERT USING (true);

-- Allow anyone to login (select by CNP)
CREATE POLICY "Allow login by CNP" ON users
  FOR SELECT USING (true);

-- Allow users to delete their own account (optional, for admin/testing)
CREATE POLICY "Allow delete by CNP" ON users
  FOR DELETE USING (true);

-- Create index on CNP for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_cnp ON users(cnp);

-- Insert some test users (optional)
-- INSERT INTO users (cnp) VALUES 
--   ('1234567890123'),
--   ('9876543210987'),
--   ('1111111111111');

-- Create a function to validate CNP format (optional)
CREATE OR REPLACE FUNCTION validate_cnp(cnp_input VARCHAR(13))
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if CNP is exactly 13 digits
  IF cnp_input ~ '^[0-9]{13}$' THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to validate CNP before insert (optional)
CREATE OR REPLACE FUNCTION check_cnp_format()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validate_cnp(NEW.cnp) THEN
    RAISE EXCEPTION 'CNP must be exactly 13 digits';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_cnp_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_cnp_format(); 