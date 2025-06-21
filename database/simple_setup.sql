-- =====================================================
-- Simple Supabase Setup for Election Candidates
-- =====================================================

-- 1. Create Party Enum Type
CREATE TYPE party_type AS ENUM ('PSD', 'PNL', 'POT', 'AUR', 'Independent');

-- 2. Create Candidates Table
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    party party_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Indexes
CREATE INDEX idx_candidates_party ON candidates(party);
CREATE INDEX idx_candidates_name ON candidates(name);

-- 4. Insert Initial Data
INSERT INTO candidates (name, description, image_url, party) VALUES
(
    'Alexandru Popescu',
    'Experienced leader with over 15 years in public service. Committed to economic development, job creation, and infrastructure improvement.',
    'https://picsum.photos/200/200?random=1',
    'PSD'
),
(
    'Maria Ionescu',
    'Dedicated advocate for education reform and digital transformation. With a background in technology and education.',
    'https://picsum.photos/200/200?random=2',
    'PNL'
),
(
    'Victor Dumitrescu',
    'Environmental activist and sustainability expert. Committed to protecting our environment while promoting green energy solutions.',
    'https://picsum.photos/200/200?random=3',
    'POT'
),
(
    'Elena Georgescu',
    'Healthcare professional with 20 years of experience. Focuses on improving healthcare accessibility and reducing costs.',
    'https://picsum.photos/200/200?random=4',
    'AUR'
),
(
    'Ion Vasilescu',
    'Independent candidate with a strong background in business and community development. Believes in transparent governance.',
    'https://picsum.photos/200/200?random=5',
    'Independent'
),
(
    'Ana Marin',
    'Youth advocate and social worker. Passionate about creating opportunities for young people and building stronger communities.',
    'https://picsum.photos/200/200?random=6',
    'PSD'
),
(
    'Stefan Radu',
    'Technology entrepreneur and innovation leader. Aims to transform our region into a tech hub and create high-paying jobs.',
    'https://picsum.photos/200/200?random=7',
    'PNL'
),
(
    'Cristina Munteanu',
    'Cultural preservationist and arts advocate. Works to protect our cultural heritage and promote cultural tourism.',
    'https://picsum.photos/200/200?random=8',
    'Independent'
);

-- 5. Create Statistics View
CREATE VIEW party_statistics AS
SELECT 
    party,
    COUNT(*) as candidate_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM candidates)), 2) as percentage
FROM candidates
GROUP BY party
ORDER BY candidate_count DESC;

-- 6. Enable RLS (Row Level Security)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- 7. Create Basic RLS Policies
CREATE POLICY "Allow public read access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON candidates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON candidates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON candidates FOR DELETE USING (auth.role() = 'authenticated');

-- 8. Grant Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON candidates TO authenticated;
GRANT USAGE ON SEQUENCE candidates_id_seq TO authenticated;
GRANT SELECT ON candidates TO anon;
GRANT SELECT ON party_statistics TO anon;

-- Setup Complete! 🎉 