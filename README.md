# Election Candidates Application

A full-stack React TypeScript application for managing election candidates with real-time statistics and CRUD operations.

## Features

- **Candidate Management**: Create, read, update, and delete election candidates
- **Party Restrictions**: Only allows specific parties (PSD, PNL, POT, AUR, Independent)
- **Statistics Dashboard**: Real-time charts showing party distribution
- **Fake Candidate Generation**: Automated generation of candidates for testing
- **Modal Forms**: Professional popup forms for adding/editing candidates
- **Responsive Design**: Works on desktop and mobile devices
- **WebSocket Integration**: Real-time updates (frontend ready)

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Chart.js for statistics visualization
- CSS3 with modern styling and animations

### Backend
- Node.js with Express
- TypeScript
- CORS enabled for frontend communication
- In-memory data storage (no database yet)

## Project Structure

```
my-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── context/        # React context (WebSocket)
│   │   └── ...
│   └── package.json
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── data/          # Data layer
│   │   ├── types/         # TypeScript types
│   │   └── app.ts         # Main application
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:3001`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will start on `http://localhost:3000`

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## API Endpoints

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Statistics
- `GET /api/statistics` - Get party statistics
- `POST /api/statistics/generate` - Generate fake candidate

## Usage

### Managing Candidates
1. **View Candidates**: Navigate to the main page to see all candidates
2. **Add Candidate**: Click "Add Candidate" button to open the modal form
3. **Edit Candidate**: Click "Edit" button on any candidate card
4. **Delete Candidate**: Click "Delete" button and confirm
5. **View Details**: Click on a candidate card to see detailed information

### Statistics Dashboard
1. **Access Statistics**: Click "Statistics" button in the header
2. **View Charts**: See pie chart and bar chart of party distribution
3. **Generate Candidates**: Click "Start Generation" to automatically add fake candidates
4. **Stop Generation**: Click "Stop Generation" to halt the process

## Data Structure

### Candidate Object
```typescript
{
  id: number;
  name: string;
  description: string;
  image: string;
  party: 'PSD' | 'PNL' | 'POT' | 'AUR' | 'Independent';
}
```

### Statistics Object
```typescript
{
  totalCandidates: number;
  partyStats: Array<{
    party: string;
    count: number;
  }>;
  mostPopularParty: string;
}
```

## Development

### Backend Development
- The backend uses TypeScript with Express
- Data is stored in memory (no database)
- CORS is configured for frontend communication
- All endpoints include proper error handling and validation

### Frontend Development
- React with TypeScript for type safety
- Modal forms for better UX
- Responsive design with CSS Grid and Flexbox
- Chart.js integration for statistics visualization

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- User authentication and authorization
- File upload for candidate images
- Advanced filtering and search
- Real-time WebSocket updates
- Unit and integration tests
- Docker containerization

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure Node.js is installed
   - Check if port 3001 is available
   - Run `npm install` in backend directory

2. **Frontend can't connect to backend**
   - Verify backend is running on port 3001
   - Check CORS configuration
   - Ensure API_BASE_URL is correct in frontend

3. **TypeScript compilation errors**
   - Run `npm install` in both directories
   - Check TypeScript version compatibility
   - Verify all type definitions are imported correctly

## License

This project is licensed under the ISC License. 