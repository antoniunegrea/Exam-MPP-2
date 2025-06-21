import { Candidate, ALLOWED_PARTIES } from '../types/Candidate';
import { addCandidate } from '../data/candidates';

// Romanian names for generating fake candidates
const romanianNames = [
  'Alexandru Popescu', 'Maria Ionescu', 'Victor Dumitrescu', 'Elena Georgescu',
  'Ion Vasilescu', 'Ana Marin', 'Stefan Radu', 'Cristina Munteanu',
  'Mihai Stoica', 'Laura Dragomir', 'Andrei Neagu', 'Diana Popa',
  'Bogdan Tudor', 'Roxana Stan', 'Florin Cirstea', 'Gabriela Lupu',
  'Adrian Mocanu', 'Simona Dumitru', 'Radu Popa', 'Ioana Ionescu',
  'Cristian Marin', 'Elena Popescu', 'Marius Vasile', 'Andreea Munteanu',
  'Dragos Neagu', 'Raluca Stan', 'Valentin Cirstea', 'Monica Lupu',
  'Bogdan Mocanu', 'Ana Dumitru', 'Stefan Popa', 'Maria Ionescu'
];

// Campaign descriptions for generating fake candidates
const campaignDescriptions = [
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

export const generateFakeCandidate = (): Omit<Candidate, 'id'> => {
  const randomName = romanianNames[Math.floor(Math.random() * romanianNames.length)];
  const randomDescription = campaignDescriptions[Math.floor(Math.random() * campaignDescriptions.length)];
  const randomParty = ALLOWED_PARTIES[Math.floor(Math.random() * ALLOWED_PARTIES.length)];
  const randomImageId = Math.floor(Math.random() * 1000);
  
  return {
    name: randomName,
    description: randomDescription,
    image: `https://picsum.photos/200/200?random=${randomImageId}`,
    party: randomParty
  };
};

export const generateAndAddCandidate = (): Candidate => {
  const fakeCandidate = generateFakeCandidate();
  return addCandidate(fakeCandidate);
};

// Statistics for party distribution
export const getPartyStatistics = () => {
  const { getAllCandidates } = require('../data/candidates');
  const candidates = getAllCandidates();
  
  const partyStats = ALLOWED_PARTIES.map(party => ({
    party,
    count: candidates.filter(c => c.party === party).length
  }));

  return {
    totalCandidates: candidates.length,
    partyStats,
    mostPopularParty: partyStats.reduce((max, stat) => 
      stat.count > max.count ? stat : max
    ).party
  };
}; 