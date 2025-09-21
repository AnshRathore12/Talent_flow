import { http, HttpResponse, delay } from 'msw';
import { DatabaseService } from '../lib/database.js';

// Utility functions
const randomDelay = () => Math.floor(Math.random() * 1000) + 200; // 200-1200ms
const shouldError = () => Math.random() < 0.08; // 8% error rate on writes

const errorResponse = (message = 'Internal Server Error', status = 500) => {
  return HttpResponse.json({ error: message }, { status });
};

export const handlers = [
  // Jobs endpoints
  http.get('/api/jobs', async ({ request }) => {
    await delay(randomDelay());
    
    const url = new URL(request.url);
    const filters = {
      search: url.searchParams.get('search') || '',
      status: url.searchParams.get('status') || '',
      page: url.searchParams.get('page') || '1',
      pageSize: url.searchParams.get('pageSize') || '10',
      sort: url.searchParams.get('sort') || ''
    };
    
    try {
      const result = await DatabaseService.getAllJobs(filters);
      return HttpResponse.json(result);
    } catch (error) {
      return errorResponse(error.message);
    }
  }),
  
  http.post('/api/jobs', async ({ request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to create job');
    }
    
    try {
      const job = await request.json();
      const newJob = await DatabaseService.createJob(job);
      return HttpResponse.json(newJob, { status: 201 });
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }),
  
  http.patch('/api/jobs/:id', async ({ params, request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to update job');
    }
    
    try {
      const updates = await request.json();
      const updatedJob = await DatabaseService.updateJob(parseInt(params.id), updates);
      return HttpResponse.json(updatedJob);
    } catch (error) {
      return errorResponse(error.message, 404);
    }
  }),
  
  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    await delay(randomDelay());
    
    // Higher error rate for reorder to test rollback
    if (Math.random() < 0.1) { // 10% error rate
      return errorResponse('Reorder operation failed');
    }
    
    try {
      const { fromOrder, toOrder } = await request.json();
      await DatabaseService.reorderJobs(fromOrder, toOrder);
      return HttpResponse.json({ success: true });
    } catch (error) {
      return errorResponse(error.message);
    }
  }),
  
  // Candidates endpoints
  http.get('/api/candidates', async ({ request }) => {
    await delay(randomDelay());
    
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const stage = url.searchParams.get('stage');
    const jobId = url.searchParams.get('jobId');
    
    try {
      let candidates;
      
      if (search) {
        candidates = await DatabaseService.searchCandidates(search);
      } else if (stage) {
        candidates = await DatabaseService.getCandidatesByStage(stage);
      } else if (jobId) {
        candidates = await DatabaseService.getCandidatesByJobId(parseInt(jobId));
      } else {
        candidates = await DatabaseService.getAllCandidates();
      }
      
      return HttpResponse.json({ candidates });
    } catch (error) {
      return errorResponse(error.message);
    }
  }),

  http.get('/api/candidates/stats', async () => {
    await delay(randomDelay());
    
    try {
      const stats = await DatabaseService.getCandidateStats();
      return HttpResponse.json(stats);
    } catch (error) {
      return errorResponse(error.message);
    }
  }),

  http.get('/api/candidates/:id', async ({ params }) => {
    await delay(randomDelay());
    
    try {
      const candidate = await DatabaseService.getCandidateById(parseInt(params.id));
      if (!candidate) {
        return HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });
      }
      return HttpResponse.json(candidate);
    } catch (error) {
      return errorResponse(error.message);
    }
  }),
  
  http.post('/api/candidates', async ({ request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to create candidate');
    }
    
    try {
      const candidate = await request.json();
      const newCandidateId = await DatabaseService.addCandidate(candidate);
      const newCandidate = await DatabaseService.getCandidateById(newCandidateId);
      return HttpResponse.json(newCandidate, { status: 201 });
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }),
  
  http.patch('/api/candidates/:id', async ({ params, request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to update candidate');
    }
    
    try {
      const updates = await request.json();
      const updatedCandidate = await DatabaseService.updateCandidate(parseInt(params.id), updates);
      return HttpResponse.json(updatedCandidate);
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }),

  http.delete('/api/candidates/:id', async ({ params }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to delete candidate');
    }
    
    try {
      await DatabaseService.deleteCandidate(parseInt(params.id));
      return HttpResponse.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }),

  http.patch('/api/candidates/bulk', async ({ request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to update candidates');
    }
    
    try {
      const { candidateIds, updates } = await request.json();
      const results = await DatabaseService.bulkUpdateCandidates(candidateIds, updates);
      return HttpResponse.json(results);
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }),
  
  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await delay(randomDelay());
    
    try {
      const timeline = await DatabaseService.getCandidateTimeline(parseInt(params.id));
      return HttpResponse.json(timeline);
    } catch (error) {
      return errorResponse(error.message);
    }
  }),
  
  // Assessments endpoints
  http.get('/api/assessments/:jobId', async ({ params }) => {
    await delay(randomDelay());
    
    try {
      const assessment = await DatabaseService.getAssessmentByJobId(parseInt(params.jobId));
      if (!assessment) {
        return HttpResponse.json(null, { status: 404 });
      }
      return HttpResponse.json(assessment);
    } catch (error) {
      return errorResponse(error.message);
    }
  }),
  
  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to save assessment');
    }
    
    try {
      const assessment = await request.json();
      const result = await DatabaseService.saveAssessment({
        ...assessment,
        jobId: parseInt(params.jobId)
      });
      return HttpResponse.json(result);
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }),
  
  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    await delay(randomDelay());
    
    if (shouldError()) {
      return errorResponse('Failed to submit assessment');
    }
    
    try {
      const responseData = await request.json();
      const assessmentId = parseInt(params.jobId);
      
      const result = await DatabaseService.submitAssessmentResponse({
        assessmentId,
        ...responseData
      });
      
      return HttpResponse.json(result, { status: 201 });
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  })
];
