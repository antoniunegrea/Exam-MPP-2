import { Candidate } from '../types/Candidate';

// Hardcoded candidate data
export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Alexandru Popescu",
    description: "Experienced leader with over 15 years in public service. Committed to economic development, job creation, and infrastructure improvement. Focused on bringing innovative solutions to modern challenges.",
    image: "https://picsum.photos/200/200?random=1",
    party: "PSD"
  },
  {
    id: 2,
    name: "Maria Ionescu",
    description: "Dedicated advocate for education reform and digital transformation. With a background in technology and education, Maria aims to modernize our educational system and prepare students for the future.",
    image: "https://picsum.photos/200/200?random=2",
    party: "PNL"
  },
  {
    id: 3,
    name: "Victor Dumitrescu",
    description: "Environmental activist and sustainability expert. Victor is committed to protecting our environment while promoting green energy solutions and sustainable development practices.",
    image: "https://picsum.photos/200/200?random=3",
    party: "POT"
  },
  {
    id: 4,
    name: "Elena Georgescu",
    description: "Healthcare professional with 20 years of experience. Elena focuses on improving healthcare accessibility, reducing costs, and implementing modern medical technologies for better patient care.",
    image: "https://picsum.photos/200/200?random=4",
    party: "AUR"
  },
  {
    id: 5,
    name: "Ion Vasilescu",
    description: "Independent candidate with a strong background in business and community development. Ion believes in transparent governance and direct citizen participation in decision-making processes.",
    image: "https://picsum.photos/200/200?random=5",
    party: "Independent"
  },
  {
    id: 6,
    name: "Ana Marin",
    description: "Youth advocate and social worker. Ana is passionate about creating opportunities for young people, improving mental health services, and building stronger communities through social programs.",
    image: "https://picsum.photos/200/200?random=6",
    party: "PSD"
  },
  {
    id: 7,
    name: "Stefan Radu",
    description: "Technology entrepreneur and innovation leader. Stefan aims to transform our region into a tech hub, create high-paying jobs, and implement smart city solutions for better urban living.",
    image: "https://picsum.photos/200/200?random=7",
    party: "PNL"
  },
  {
    id: 8,
    name: "Cristina Munteanu",
    description: "Cultural preservationist and arts advocate. Cristina works to protect our cultural heritage, support local artists, and promote cultural tourism as a driver of economic growth.",
    image: "https://picsum.photos/200/200?random=8",
    party: "Independent"
  }
];

let nextId = Math.max(...candidates.map(c => c.id)) + 1;

export const getNextId = (): number => {
  return nextId++;
};

export const addCandidate = (candidate: Omit<Candidate, 'id'>): Candidate => {
  const newCandidate: Candidate = {
    ...candidate,
    id: getNextId()
  };
  candidates.push(newCandidate);
  return newCandidate;
};

export const updateCandidate = (id: number, updates: Partial<Candidate>): Candidate | null => {
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  candidates[index] = { ...candidates[index], ...updates };
  return candidates[index];
};

export const deleteCandidate = (id: number): boolean => {
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  candidates.splice(index, 1);
  return true;
};

export const getCandidateById = (id: number): Candidate | null => {
  return candidates.find(c => c.id === id) || null;
};

export const getAllCandidates = (): Candidate[] => {
  return [...candidates];
}; 