/**
 * Example usage of Dummy Candidate Data
 * This file demonstrates how to use the dummy candidate data in your application.
 */

import { 
  dummyCandidates, 
  getCandidatesByJobId, 
  getCandidatesByStage, 
  searchCandidates 
} from './dummyCandidateData';

// Example 1: Get all candidates
console.log('All candidates:', dummyCandidates);

// Example 2: Get candidates for a specific job
const jobId = 1; // Frontend Developer job
const frontendCandidates = getCandidatesByJobId(jobId);
console.log(`Candidates for Job ID ${jobId}:`, frontendCandidates);

// Example 3: Get candidates by stage
const appliedCandidates = getCandidatesByStage('Applied');
console.log('Applied candidates:', appliedCandidates);

// Example 4: Search candidates by name or skills
const searchResults = searchCandidates('react');
console.log('Search results for "react":', searchResults);

/**
 * Usage in React Components:
 * 
 * import { dummyCandidates } from '../mocks/dummyCandidateData';
 * 
 * function CandidatesList() {
 *   const [candidates, setCandidates] = useState(dummyCandidates);
 *   
 *   // Filter, sort, or manipulate the candidates data as needed
 *   
 *   return (
 *     <div>
 *       {candidates.map(candidate => (
 *         <CandidateCard key={candidate.id} candidate={candidate} />
 *       ))}
 *     </div>
 *   );
 * }
 */

/**
 * Integration with Mock Service Worker:
 * 
 * // In your handlers.js file
 * import { dummyCandidates } from './dummyCandidateData';
 * 
 * export const handlers = [
 *   rest.get('/api/candidates', (req, res, ctx) => {
 *     return res(
 *       ctx.status(200),
 *       ctx.json({ candidates: dummyCandidates })
 *     );
 *   }),
 *   
 *   rest.get('/api/candidates/:id', (req, res, ctx) => {
 *     const { id } = req.params;
 *     const candidate = dummyCandidates.find(c => c.id === parseInt(id));
 *     
 *     if (candidate) {
 *       return res(ctx.status(200), ctx.json(candidate));
 *     }
 *     
 *     return res(ctx.status(404), ctx.json({ message: 'Candidate not found' }));
 *   }),
 * ];
 */