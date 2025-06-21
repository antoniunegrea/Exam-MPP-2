# Election Candidates Frontend

A modern React TypeScript application for displaying election candidates with a master-detail view pattern.

## Features

- **Master Page**: Displays a list of candidates with their basic information
- **Detail Page**: Shows comprehensive information about a selected candidate
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Error Handling**: Graceful error states and loading indicators
- **Backend Ready**: Service functions prepared for easy backend integration

## Project Structure

```
src/
├── components/
│   ├── CandidateList.tsx      # Master page component
│   ├── CandidateList.css      # Styles for candidate list
│   ├── CandidateDetail.tsx    # Detail page component
│   └── CandidateDetail.css    # Styles for candidate detail
├── types/
│   └── Candidate.ts           # TypeScript interfaces and data
├── App.tsx                    # Main app component with routing
├── App.css                    # Global styles
└── index.tsx                  # Application entry point
```

## Components

### CandidateList (Master Page)
- Displays candidates in a responsive grid layout
- Shows candidate image, name, party, and truncated description
- Clickable cards that navigate to detail view
- Loading and error states
- Hover effects and smooth animations

### CandidateDetail (Detail Page)
- Comprehensive candidate information display
- Large candidate image and full description
- Campaign highlights and contact information
- Action buttons for campaign support and sharing
- Back navigation to master page

## Data Structure

```typescript
interface Candidate {
  id: number;
  name: string;
  description: string;
  image: string; // URL to the candidate's image
  party: string;
}
```

## Backend Integration

The application is designed to easily integrate with a backend API. The service functions in `types/Candidate.ts` are ready to be updated:

```typescript
// Current implementation (hardcoded data)
export const getCandidates = async (): Promise<Candidate[]> => {
  return Promise.resolve(candidates);
};

// Future implementation (API calls)
export const getCandidates = async (): Promise<Candidate[]> => {
  return fetch('/api/candidates').then(res => res.json());
};
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Routing

- `/` - Master page (candidate list)
- `/candidate/:id` - Detail page for a specific candidate

## Styling

The application uses:
- CSS Grid and Flexbox for responsive layouts
- CSS custom properties for consistent theming
- Smooth transitions and hover effects
- Mobile-first responsive design
- Modern gradient backgrounds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Search and filtering functionality
- Pagination for large candidate lists
- Candidate comparison feature
- Voting functionality
- Real-time updates
- Accessibility improvements
- Unit and integration tests

## Contributing

1. Follow the existing code style and structure
2. Add proper TypeScript types for new features
3. Ensure responsive design works on all screen sizes
4. Test error states and edge cases
5. Update documentation for new features
