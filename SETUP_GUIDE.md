# Setup Guide: Backend + Supabase Integration

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database/supabase_setup.sql`
3. Paste it into the SQL editor and run it
4. This will create all necessary tables, views, and functions

## Step 4: Configure Backend Environment

1. In the `backend` folder, copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

## Step 5: Test the Backend

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```

3. Test the candidates endpoint:
   ```bash
   curl http://localhost:3001/api/candidates
   ```

## Step 6: Verify Database Connection

1. Check if candidates are being fetched from the database
2. Try creating a new candidate via the API
3. Verify the data appears in your Supabase dashboard under **Table Editor** → **candidates**

## Troubleshooting

### Common Issues:

1. **"Missing Supabase configuration" error**
   - Make sure your `.env` file exists and has the correct values
   - Verify the file is in the `backend` folder

2. **Database connection errors**
   - Check if your Supabase project is active
   - Verify the URL and keys are correct
   - Make sure you ran the SQL setup script

3. **CORS errors from frontend**
   - Ensure `FRONTEND_URL` in `.env` matches your frontend URL
   - Check if both frontend and backend are running

4. **"Table does not exist" errors**
   - Make sure you ran the complete `supabase_setup.sql` script
   - Check the **Table Editor** in Supabase to verify tables exist

### Verification Steps:

1. **Check Supabase Dashboard**:
   - Go to **Table Editor** → you should see `candidates` table
   - Go to **SQL Editor** → you should see `party_statistics` view
   - Go to **Database** → **Functions** → you should see `generate_fake_candidate`

2. **Test API Endpoints**:
   ```bash
   # Health check
   curl http://localhost:3001/health
   
   # Get candidates
   curl http://localhost:3001/api/candidates
   
   # Get statistics
   curl http://localhost:3001/api/statistics/party
   
   # Generate fake candidate
   curl -X POST http://localhost:3001/api/candidates/generate
   ```

## Next Steps

Once the backend is connected to Supabase:

1. Start your frontend application
2. Test all CRUD operations through the UI
3. Verify real-time statistics updates
4. Test the fake candidate generation feature

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- The `service_role` key has admin privileges - use it carefully
- The `anon` key is safe to use in frontend applications
- Row Level Security (RLS) is enabled on the database tables

## Support

If you encounter issues:
1. Check the backend console for error messages
2. Verify your Supabase project settings
3. Ensure all environment variables are set correctly
4. Test the database connection using the health endpoint 