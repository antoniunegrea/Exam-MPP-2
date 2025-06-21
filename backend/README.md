# Election Candidates Backend

A Node.js/Express backend API for managing election candidates with Supabase database integration.

## Features

- **CRUD Operations**: Create, read, update, and delete candidates
- **Party Management**: Restricted to specific Romanian political parties (PSD, PNL, POT, AUR, Independent)
- **Statistics**: Real-time party statistics and comprehensive analytics
- **Fake Data Generation**: Automated candidate generation for testing
- **Database Integration**: Full Supabase PostgreSQL integration
- **TypeScript**: Fully typed with TypeScript
- **Environment Configuration**: Secure environment variable management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your Supabase credentials:

```bash
cp env.example .env
```

Edit `.env` with your Supabase project details:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Run the Supabase setup script in your Supabase SQL editor:

```sql
-- Copy and run the contents of database/supabase_setup.sql
```

This will create:
- `party_type` enum
- `candidates` table with indexes and triggers
- `party_statistics` view
- RLS policies
- Initial sample data
- Functions for fake candidate generation

### 4. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your `.env`).

## API Endpoints

### Candidates

- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate
- `POST /api/candidates/generate` - Generate fake candidate

### Statistics

- `GET /api/statistics/party` - Get party statistics
- `GET /api/statistics/comprehensive` - Get comprehensive statistics
- `POST /api/statistics/generate` - Generate fake candidate

### Health Check

- `GET /health` - Server health status

## Data Models

### Candidate

```typescript
interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  party: 'PSD' | 'PNL' | 'POT' | 'AUR' | 'Independent';
  created_at: string;
  updated_at: string;
}
```

### Party Statistics

```typescript
interface PartyStatistics {
  party: string;
  candidate_count: number;
  percentage: number;
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Optional |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Database Schema

### Candidates Table

```sql
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  party party_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Party Types

- PSD (Partidul Social Democrat)
- PNL (Partidul Național Liberal)
- POT (Partidul Oamenilor, Muncii și Antreprenoriatului)
- AUR (Alianța pentru Unirea României)
- Independent

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

All errors include descriptive messages and, in development mode, detailed error information.

## Development

### Project Structure

```
src/
├── config/
│   └── supabase.ts          # Supabase configuration
├── controllers/
│   ├── candidateController.ts
│   └── statisticsController.ts
├── routes/
│   ├── candidateRoutes.ts
│   └── statisticsRoutes.ts
├── services/
│   └── databaseService.ts   # Database operations
└── app.ts                   # Main application
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build TypeScript to JavaScript
- `npm test` - Run tests (if configured)

## Security

- **CORS**: Configured for specific frontend origins
- **Input Validation**: All inputs are validated
- **SQL Injection Protection**: Using Supabase client with parameterized queries
- **Environment Variables**: Sensitive data stored in environment variables
- **RLS**: Row Level Security enabled on database tables

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase URL and keys in `.env`
   - Check if Supabase project is active
   - Ensure database schema is properly set up

2. **CORS Errors**
   - Verify `FRONTEND_URL` in `.env` matches your frontend URL
   - Check if frontend is running on the correct port

3. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`

### Logs

The server logs important information including:
- Server startup details
- Database connection status
- API request/response logs
- Error details (in development mode)

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Update documentation for new features
5. Test all endpoints before committing

## License

This project is part of the MPP Lab examination. 