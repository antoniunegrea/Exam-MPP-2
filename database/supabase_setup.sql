-- =====================================================
-- Election Candidates Database Setup for Supabase
-- =====================================================

-- Enable Row Level Security (RLS) for the table
-- This is a Supabase best practice for security

-- =====================================================
-- 1. CREATE ENUM TYPE FOR PARTY VALUES
-- =====================================================

CREATE TYPE party_type AS ENUM ('PSD', 'PNL', 'POT', 'AUR', 'Independent');

-- =====================================================
-- 2. CREATE CANDIDATES TABLE
-- =====================================================

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    party party_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Index on party for faster filtering and statistics
CREATE INDEX idx_candidates_party ON candidates(party);

-- Index on name for search functionality
CREATE INDEX idx_candidates_name ON candidates(name);

-- Index on created_at for sorting by date
CREATE INDEX idx_candidates_created_at ON candidates(created_at);

-- =====================================================
-- 4. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 5. CREATE TRIGGER TO AUTO-UPDATE UPDATED_AT
-- =====================================================

CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- Policy for reading candidates (public read access)
CREATE POLICY "Allow public read access to candidates" ON candidates
    FOR SELECT USING (true);

-- Policy for inserting candidates (authenticated users only)
CREATE POLICY "Allow authenticated users to insert candidates" ON candidates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating candidates (authenticated users only)
CREATE POLICY "Allow authenticated users to update candidates" ON candidates
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for deleting candidates (authenticated users only)
CREATE POLICY "Allow authenticated users to delete candidates" ON candidates
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 8. INSERT INITIAL CANDIDATE DATA
-- =====================================================

INSERT INTO candidates (name, description, image_url, party) VALUES
(
    'Alexandru Popescu',
    'Experienced leader with over 15 years in public service. Committed to economic development, job creation, and infrastructure improvement. Focused on bringing innovative solutions to modern challenges.',
    'https://picsum.photos/200/200?random=1',
    'PSD'
),
(
    'Maria Ionescu',
    'Dedicated advocate for education reform and digital transformation. With a background in technology and education, Maria aims to modernize our educational system and prepare students for the future.',
    'https://picsum.photos/200/200?random=2',
    'PNL'
),
(
    'Victor Dumitrescu',
    'Environmental activist and sustainability expert. Victor is committed to protecting our environment while promoting green energy solutions and sustainable development practices.',
    'https://picsum.photos/200/200?random=3',
    'POT'
),
(
    'Elena Georgescu',
    'Healthcare professional with 20 years of experience. Elena focuses on improving healthcare accessibility, reducing costs, and implementing modern medical technologies for better patient care.',
    'https://picsum.photos/200/200?random=4',
    'AUR'
),
(
    'Ion Vasilescu',
    'Independent candidate with a strong background in business and community development. Ion believes in transparent governance and direct citizen participation in decision-making processes.',
    'https://picsum.photos/200/200?random=5',
    'Independent'
),
(
    'Ana Marin',
    'Youth advocate and social worker. Ana is passionate about creating opportunities for young people, improving mental health services, and building stronger communities through social programs.',
    'https://picsum.photos/200/200?random=6',
    'PSD'
),
(
    'Stefan Radu',
    'Technology entrepreneur and innovation leader. Stefan aims to transform our region into a tech hub, create high-paying jobs, and implement smart city solutions for better urban living.',
    'https://picsum.photos/200/200?random=7',
    'PNL'
),
(
    'Cristina Munteanu',
    'Cultural preservationist and arts advocate. Cristina works to protect our cultural heritage, support local artists, and promote cultural tourism as a driver of economic growth.',
    'https://picsum.photos/200/200?random=8',
    'Independent'
);

-- =====================================================
-- 9. CREATE VIEW FOR PARTY STATISTICS
-- =====================================================

CREATE VIEW party_statistics AS
SELECT 
    party,
    COUNT(*) as candidate_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM candidates)), 2) as percentage
FROM candidates
GROUP BY party
ORDER BY candidate_count DESC;

-- =====================================================
-- 10. CREATE FUNCTION TO GENERATE FAKE CANDIDATES
-- =====================================================

CREATE OR REPLACE FUNCTION generate_fake_candidate()
RETURNS candidates AS $$
DECLARE
    new_candidate candidates;
    romanian_names TEXT[] := ARRAY[
        'Alexandru Popescu', 'Maria Ionescu', 'Victor Dumitrescu', 'Elena Georgescu',
        'Ion Vasilescu', 'Ana Marin', 'Stefan Radu', 'Cristina Munteanu',
        'Mihai Stoica', 'Laura Dragomir', 'Andrei Neagu', 'Diana Popa',
        'Bogdan Tudor', 'Roxana Stan', 'Florin Cirstea', 'Gabriela Lupu',
        'Adrian Mocanu', 'Simona Dumitru', 'Radu Popa', 'Ioana Ionescu',
        'Cristian Marin', 'Elena Popescu', 'Marius Vasile', 'Andreea Munteanu',
        'Dragos Neagu', 'Raluca Stan', 'Valentin Cirstea', 'Monica Lupu',
        'Bogdan Mocanu', 'Ana Dumitru', 'Stefan Popa', 'Maria Ionescu'
    ];
    campaign_descriptions TEXT[] := ARRAY[
        'Experienced leader focused on economic development and job creation.',
        'Advocate for education reform and digital transformation.',
        'Committed to environmental protection and sustainable development.',
        'Dedicated to healthcare improvement and social welfare.',
        'Focused on infrastructure development and urban planning.',
        'Champion of youth empowerment and innovation.',
        'Expert in public administration and governance reform.',
        'Passionate about cultural preservation and community building.',
        'Technology enthusiast promoting digital innovation.',
        'Social justice advocate working for equality and inclusion.',
        'Business leader focused on economic growth and entrepreneurship.',
        'Education specialist committed to modernizing our schools.',
        'Healthcare professional dedicated to improving medical services.',
        'Environmental scientist promoting green energy solutions.',
        'Community organizer building stronger neighborhoods.',
        'Legal expert working for justice system reform.',
        'Transportation specialist improving public transit.',
        'Housing advocate ensuring affordable living for all.',
        'Small business supporter promoting local entrepreneurship.',
        'Arts and culture promoter preserving our heritage.'
    ];
    parties party_type[] := ARRAY['PSD', 'PNL', 'POT', 'AUR', 'Independent'];
    random_name TEXT;
    random_description TEXT;
    random_party party_type;
    random_image_id INTEGER;
BEGIN
    -- Select random values
    random_name := romanian_names[1 + floor(random() * array_length(romanian_names, 1))];
    random_description := campaign_descriptions[1 + floor(random() * array_length(campaign_descriptions, 1))];
    random_party := parties[1 + floor(random() * array_length(parties, 1))];
    random_image_id := floor(random() * 1000);
    
    -- Insert the new candidate
    INSERT INTO candidates (name, description, image_url, party)
    VALUES (random_name, random_description, 'https://picsum.photos/200/200?random=' || random_image_id, random_party)
    RETURNING * INTO new_candidate;
    
    RETURN new_candidate;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. CREATE FUNCTION TO GET CANDIDATE STATISTICS
-- =====================================================

CREATE OR REPLACE FUNCTION get_candidate_statistics()
RETURNS TABLE(
    total_candidates BIGINT,
    party_stats JSON,
    most_popular_party party_type
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM candidates) as total_candidates,
        (SELECT json_agg(json_build_object('party', party, 'count', candidate_count))
         FROM party_statistics) as party_stats,
        (SELECT party FROM party_statistics ORDER BY candidate_count DESC LIMIT 1) as most_popular_party;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12. GRANT PERMISSIONS (if using custom roles)
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON candidates TO authenticated;
GRANT USAGE ON SEQUENCE candidates_id_seq TO authenticated;

-- Grant permissions to anon users for read-only access
GRANT SELECT ON candidates TO anon;
GRANT SELECT ON party_statistics TO anon;
GRANT EXECUTE ON FUNCTION get_candidate_statistics() TO anon;
GRANT EXECUTE ON FUNCTION generate_fake_candidate() TO authenticated;

-- =====================================================
-- 13. VERIFICATION QUERIES
-- =====================================================

-- Uncomment these queries to verify the setup:

-- SELECT * FROM candidates ORDER BY id;
-- SELECT * FROM party_statistics;
-- SELECT * FROM get_candidate_statistics();
-- SELECT generate_fake_candidate();

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- The database is now ready for the Election Candidates application!
-- 
-- Features included:
-- ✅ Candidates table with proper constraints
-- ✅ Party enum type with restricted values
-- ✅ Automatic updated_at timestamp
-- ✅ Row Level Security (RLS) policies
-- ✅ Performance indexes
-- ✅ Initial candidate data
-- ✅ Party statistics view
-- ✅ Fake candidate generation function
-- ✅ Statistics function
-- ✅ Proper permissions 