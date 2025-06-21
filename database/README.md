# Supabase Database Setup for Election Candidates

This directory contains SQL scripts to set up the database for the Election Candidates application in Supabase.

## 📁 Files

- **`simple_setup.sql`** - Basic setup with essential features (recommended for quick start)
- **`supabase_setup.sql`** - Complete setup with advanced features (recommended for production)

## 🚀 Quick Setup (Recommended)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### Step 2: Run the SQL Script
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `simple_setup.sql`
4. Paste and run the script

### Step 3: Verify Setup
Run these queries in the SQL Editor to verify everything works:

```sql
-- Check if table was created
SELECT * FROM candidates ORDER BY id;

-- Check party statistics
SELECT * FROM party_statistics;

-- Check table structure
\d candidates;
```

## 🏗️ Complete Setup (Advanced)

If you want all the advanced features, use `supabase_setup.sql` instead. This includes:

- ✅ Automatic `updated_at` timestamp triggers
- ✅ Advanced RLS policies
- ✅ Fake candidate generation function
- ✅ Statistics function
- ✅ Performance optimizations
- ✅ Comprehensive permissions

## 📊 Database Schema

### Candidates Table
```sql
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    party party_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Party Type Enum
```sql
CREATE TYPE party_type AS ENUM ('PSD', 'PNL', 'POT', 'AUR', 'Independent');
```

### Party Statistics View
```sql
CREATE VIEW party_statistics AS
SELECT 
    party,
    COUNT(*) as candidate_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM candidates)), 2) as percentage
FROM candidates
GROUP BY party
ORDER BY candidate_count DESC;
```

## 🔐 Security Features

### Row Level Security (RLS)
- **Public Read Access**: Anyone can view candidates
- **Authenticated Write Access**: Only authenticated users can create/update/delete

### RLS Policies
```sql
-- Public read access
CREATE POLICY "Allow public read access" ON candidates FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow authenticated insert" ON candidates FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Allow authenticated update" ON candidates FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Allow authenticated delete" ON candidates FOR DELETE USING (auth.role() = 'authenticated');
```

## 📈 Performance Optimizations

### Indexes
- `idx_candidates_party` - Fast party filtering and statistics
- `idx_candidates_name` - Fast name search
- `idx_candidates_created_at` - Fast date sorting

## 🎯 API Integration

Once the database is set up, you can integrate it with your backend by:

1. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configure Environment Variables**:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Update Backend** to use Supabase instead of in-memory storage

## 🔍 Useful Queries

### Get All Candidates
```sql
SELECT * FROM candidates ORDER BY created_at DESC;
```

### Get Candidates by Party
```sql
SELECT * FROM candidates WHERE party = 'PSD';
```

### Get Party Statistics
```sql
SELECT * FROM party_statistics;
```

### Search Candidates by Name
```sql
SELECT * FROM candidates WHERE name ILIKE '%Alexandru%';
```

### Get Recent Candidates
```sql
SELECT * FROM candidates ORDER BY created_at DESC LIMIT 5;
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Denied**
   - Make sure RLS policies are correctly set up
   - Check if you're authenticated for write operations

2. **Enum Type Error**
   - Ensure the `party_type` enum is created before the table
   - Check that party values match the enum exactly

3. **Sequence Error**
   - Make sure the `candidates_id_seq` sequence exists
   - Grant proper permissions to authenticated users

### Reset Database
If you need to start over:

```sql
-- Drop everything (be careful!)
DROP TABLE IF EXISTS candidates CASCADE;
DROP TYPE IF EXISTS party_type CASCADE;
DROP VIEW IF EXISTS party_statistics CASCADE;

-- Then run the setup script again
```

## 📝 Notes

- The database uses **PostgreSQL** (Supabase's default)
- **Row Level Security (RLS)** is enabled for security
- **Timestamps** are automatically managed
- **Party values** are restricted to the enum type
- **Initial data** includes 8 sample candidates

## 🎉 Next Steps

After setting up the database:

1. Update your backend to use Supabase client
2. Test the API endpoints
3. Update frontend to handle authentication if needed
4. Deploy your application

The database is now ready for your Election Candidates application! 🚀 