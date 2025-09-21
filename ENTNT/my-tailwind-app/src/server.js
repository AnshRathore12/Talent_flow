import { createServer, Model, Factory, belongsTo, hasMany } from 'miragejs';
import { dbService } from './lib/database';

const delay = () => new Promise(resolve => 
  setTimeout(resolve, 200 + Math.random() * 1000)
);

const shouldFail = () => Math.random() < 0.08; // 8% failure rate

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    
    models: {
      job: Model.extend({
        candidates: hasMany()
      }),
      candidate: Model.extend({
        job: belongsTo()
      }),
      assessment: Model.extend({
        job: belongsTo()
      })
    },

    factories: {
      job: Factory.extend({
        title() { 
          const titles = [
            'Senior Frontend Developer', 
            'Backend Engineer', 
            'Full Stack Developer',
            'UI/UX Designer',
            'Product Manager',
            'Data Scientist'
          ];
          return titles[Math.floor(Math.random() * titles.length)];
        },
        department() {
          const departments = ['Engineering', 'Design', 'Product', 'Data'];
          return departments[Math.floor(Math.random() * departments.length)];
        },
        location: 'Remote',
        type: 'full-time',
        experience: 'mid',
        salary: '$120,000 - $160,000',
        description: 'We are looking for a talented developer to join our team...',
        requirements: 'Bachelor\'s degree in Computer Science or related field...',
        tags() {
          const tagOptions = [
            ['React', 'TypeScript', 'Node.js'],
            ['Python', 'Django', 'PostgreSQL'],
            ['JavaScript', 'Vue.js', 'Express'],
            ['Java', 'Spring', 'MySQL'],
            ['Go', 'Docker', 'Kubernetes']
          ];
          return tagOptions[Math.floor(Math.random() * tagOptions.length)];
        },
        status() {
          const statuses = ['active', 'draft', 'archived'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        },
        createdAt() { return new Date().toISOString(); },
        updatedAt() { return new Date().toISOString(); }
      }),

      candidate: Factory.extend({
        name() {
          const firstNames = [
            'Alexander', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James', 'Isabella',
            'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Mia', 'Theodore', 'Harper',
            'Sebastian', 'Evelyn', 'Oliver', 'Abigail', 'Elijah', 'Emily', 'Samuel', 'Elizabeth',
            'David', 'Sofia', 'Joseph', 'Avery', 'Carter', 'Ella', 'Owen', 'Madison',
            'Wyatt', 'Scarlett', 'John', 'Victoria', 'Jack', 'Aria', 'Luke', 'Grace',
            'Jayden', 'Chloe', 'Dylan', 'Camila', 'Grayson', 'Penelope', 'Levi', 'Riley',
            'Isaac', 'Layla', 'Gabriel', 'Lillian', 'Julian', 'Nora', 'Mateo', 'Zoey'
          ];
          
          const lastNames = [
            'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
            'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
            'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris',
            'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
            'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
            'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
            'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz'
          ];
          
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          return `${firstName} ${lastName}`;
        },
        
        email() {
          const name = this.name || 'candidate';
          const domain = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'][Math.floor(Math.random() * 4)];
          return `${name.toLowerCase().replace(/\s+/g, '.')}@${domain}`;
        },
        
        phone() {
          const areaCodes = ['415', '510', '650', '408', '925', '707', '831', '209'];
          const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
          const exchange = Math.floor(Math.random() * 900) + 100;
          const number = Math.floor(Math.random() * 9000) + 1000;
          return `+1 (${areaCode}) ${exchange}-${number}`;
        },
        
        location() {
          const locations = [
            'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
            'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Portland, OR', 'Miami, FL',
            'Remote', 'San Jose, CA', 'Oakland, CA', 'Palo Alto, CA', 'Berkeley, CA'
          ];
          return locations[Math.floor(Math.random() * locations.length)];
        },
        
        stage() {
          const stages = ['applied', 'screen', 'tech', 'offer', 'hired'];
          const weights = [0.4, 0.25, 0.2, 0.1, 0.05]; // More likely to be in earlier stages
          
          let random = Math.random();
          for (let i = 0; i < stages.length; i++) {
            random -= weights[i];
            if (random <= 0) return stages[i];
          }
          return 'applied';
        },
        
        summary() {
          const summaries = [
            'Experienced software engineer with a passion for building scalable web applications and leading development teams.',
            'Creative frontend developer specializing in React and modern JavaScript frameworks with strong UX/UI sensibilities.',
            'Full-stack developer with expertise in both frontend and backend technologies, focusing on performance optimization.',
            'Senior backend engineer with deep knowledge of distributed systems and cloud architecture.',
            'Product-minded engineer with experience in agile development and cross-functional collaboration.',
            'Data-driven developer with strong analytical skills and experience in building data visualization tools.',
            'Mobile-first developer specializing in React Native and cross-platform application development.',
            'DevOps-minded engineer with experience in CI/CD pipelines and infrastructure automation.'
          ];
          return summaries[Math.floor(Math.random() * summaries.length)];
        },
        
        experience() {
          const experiences = [
            {
              id: 1,
              title: 'Senior Software Engineer',
              company: 'Tech Corp',
              startDate: '2021-01',
              endDate: '2024-01',
              current: false,
              description: 'Led development of microservices architecture and mentored junior developers.'
            },
            {
              id: 2,
              title: 'Software Engineer',
              company: 'StartupXYZ',
              startDate: '2019-06',
              endDate: '2021-01',
              current: false,
              description: 'Built full-stack web applications using React, Node.js, and PostgreSQL.'
            }
          ];
          return experiences.slice(0, Math.floor(Math.random() * 2) + 1);
        },
        
        education() {
          const educations = [
            {
              id: 1,
              degree: 'Bachelor of Science in Computer Science',
              school: 'Stanford University',
              field: 'Computer Science',
              graduationYear: '2019',
              gpa: '3.8'
            }
          ];
          return educations;
        },
        
        skills() {
          const allSkills = [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go',
            'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes',
            'GraphQL', 'REST APIs', 'Git', 'Agile', 'Scrum', 'TDD', 'CI/CD'
          ];
          
          const numSkills = Math.floor(Math.random() * 5) + 3; // 3-7 skills
          const shuffled = allSkills.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, numSkills);
        },
        
        linkedinProfile() {
          const name = this.name || 'candidate';
          return `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`;
        },
        
        githubProfile() {
          const name = this.name || 'candidate';
          return `https://github.com/${name.toLowerCase().replace(/\s+/g, '')}`;
        },
        
        portfolioUrl() {
          const name = this.name || 'candidate';
          return `https://${name.toLowerCase().replace(/\s+/g, '')}.dev`;
        },
        
        notes() {
          const notes = [
            'Strong technical skills and great communication abilities.',
            'Excellent problem-solving skills and team collaboration.',
            'Shows initiative and has leadership potential.',
            'Good cultural fit with strong work ethic.',
            'Impressive portfolio and open source contributions.',
            'Quick learner with adaptability to new technologies.'
          ];
          return notes[Math.floor(Math.random() * notes.length)];
        },
        
        jobId() {
          // This will be set when creating candidates in relation to jobs
          return 1;
        },
        
        createdAt() { 
          const now = new Date();
          const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
          return pastDate.toISOString(); 
        },
        
        updatedAt() { 
          return new Date().toISOString(); 
        }
      }),

      assessment: Factory.extend({
        title() {
          const titles = [
            'Frontend Developer Assessment',
            'Backend Engineer Evaluation',
            'Full Stack Technical Test',
            'UI/UX Design Challenge',
            'Data Science Coding Test',
            'Product Manager Case Study',
            'System Design Interview',
            'Behavioral Assessment',
            'JavaScript Fundamentals',
            'React Developer Challenge'
          ];
          return titles[Math.floor(Math.random() * titles.length)];
        },
        description() {
          const descriptions = [
            'Comprehensive technical evaluation covering core concepts',
            'Practical coding challenges and problem-solving tasks',
            'Real-world scenarios and case study analysis',
            'Interactive assessment with multiple question types',
            'Skills-based evaluation with hands-on exercises'
          ];
          return descriptions[Math.floor(Math.random() * descriptions.length)];
        },
        type() {
          const types = ['Technical', 'Behavioral', 'Cognitive'];
          const weights = [0.6, 0.25, 0.15];
          const random = Math.random();
          let sum = 0;
          for (let i = 0; i < types.length; i++) {
            sum += weights[i];
            if (random <= sum) return types[i];
          }
          return 'Technical';
        },
        status() {
          const statuses = ['Active', 'Draft'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        },
        questionCount() {
          return Math.floor(Math.random() * 15) + 5;
        },
        duration() {
          const durations = [30, 45, 60, 90, 120];
          return durations[Math.floor(Math.random() * durations.length)];
        },
        createdAt() { return new Date().toISOString(); },
        updatedAt() { return new Date().toISOString(); }
      })
    },

    seeds(server) {
      // Create 25 initial jobs
      server.createList('job', 25);
      
      // Create candidates for each job
      const jobs = server.schema.jobs.all().models;
      jobs.forEach(job => {
        const candidateCount = Math.floor(Math.random() * 5) + 1; // 1-5 candidates per job
        for (let i = 0; i < candidateCount; i++) {
          server.create('candidate', { jobId: job.id });
        }
      });
      
      // Create 15 assessments
      for (let i = 0; i < 15; i++) {
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        server.create('assessment', {
          jobId: randomJob.id
        });
      }
    },

    routes() {
      this.namespace = 'api';
      this.timing = 1000;

      // Jobs routes
      this.get('/jobs', (schema) => {
        console.log('API: Fetching jobs');
        const jobs = schema.jobs.all().models;
        console.log('API: Returning jobs:', jobs.length);
        return { jobs };
      });

      this.post('/jobs', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        console.log('API: Creating job with data:', attrs);
        
        const job = schema.jobs.create({
          ...attrs,
          id: attrs.id || Date.now(),
          createdAt: attrs.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        console.log('API: Job created:', job);
        return job;
      });

      this.put('/jobs/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        console.log('API: Updating job', id, 'with data:', attrs);
        
        const job = schema.jobs.find(id);
        if (!job) {
          console.error('API: Job not found:', id);
          return new Response(404, {}, { error: 'Job not found' });
        }
        
        job.update({
          ...attrs,
          updatedAt: new Date().toISOString()
        });
        
        console.log('API: Job updated:', job);
        return job;
      });

      this.delete('/jobs/:id', (schema, request) => {
        const id = request.params.id;
        console.log('API: Deleting job:', id);
        
        const job = schema.jobs.find(id);
        if (!job) {
          console.error('API: Job not found:', id);
          return new Response(404, {}, { error: 'Job not found' });
        }
        
        job.destroy();
        console.log('API: Job deleted successfully');
        return new Response(204);
      });

      // Candidates routes
      this.get('/candidates', (schema) => {
        console.log('API: Fetching candidates');
        const candidates = schema.candidates.all().models;
        console.log('API: Returning candidates:', candidates.length);
        return { candidates };
      });

      this.get('/candidates/stats', (schema) => {
        console.log('API: Fetching candidate statistics');
        const candidates = schema.candidates.all().models;
        
        const stats = {
          total: candidates.length,
          active: candidates.filter(c => c.status === 'Active').length,
          inactive: candidates.filter(c => c.status === 'Inactive').length,
          byStage: {
            Applied: candidates.filter(c => c.stage === 'Applied').length,
            Screening: candidates.filter(c => c.stage === 'Screening').length,
            Technical: candidates.filter(c => c.stage === 'Technical').length,
            Interview: candidates.filter(c => c.stage === 'Interview').length,
            Final: candidates.filter(c => c.stage === 'Final').length,
            Offer: candidates.filter(c => c.stage === 'Offer').length,
            Hired: candidates.filter(c => c.stage === 'Hired').length,
            Rejected: candidates.filter(c => c.stage === 'Rejected').length,
            Withdrawn: candidates.filter(c => c.stage === 'Withdrawn').length
          },
          recentApplications: candidates.filter(c => {
            const createdDate = new Date(c.createdAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return createdDate > weekAgo;
          }).length
        };
        
        console.log('API: Returning candidate stats:', stats);
        return stats;
      });

      this.post('/candidates', (schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody);
          console.log('API: Creating candidate with data:', attrs);
          
          // Ensure we have required fields
          if (!attrs.name || !attrs.email || !attrs.jobId) {
            console.error('API: Missing required fields');
            return new Response(400, {}, { error: 'Missing required fields: name, email, jobId' });
          }

          const candidate = schema.candidates.create({
            ...attrs,
            id: attrs.id || Date.now(),
            createdAt: attrs.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Ensure arrays are properly handled
            experience: attrs.experience || [],
            education: attrs.education || [],
            skills: attrs.skills || []
          });
          
          console.log('API: Candidate created successfully:', candidate);
          return candidate;
        } catch (error) {
          console.error('API: Error creating candidate:', error);
          return new Response(500, {}, { error: 'Failed to create candidate' });
        }
      });

      this.put('/candidates/:id', (schema, request) => {
        try {
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          console.log('API: Updating candidate', id, 'with data:', attrs);
          
          const candidate = schema.candidates.find(id);
          if (!candidate) {
            console.error('API: Candidate not found:', id);
            return new Response(404, {}, { error: 'Candidate not found' });
          }
          
          candidate.update({
            ...attrs,
            updatedAt: new Date().toISOString(),
            // Ensure arrays are properly handled
            experience: attrs.experience || candidate.experience || [],
            education: attrs.education || candidate.education || [],
            skills: attrs.skills || candidate.skills || []
          });
          
          console.log('API: Candidate updated successfully:', candidate);
          return candidate;
        } catch (error) {
          console.error('API: Error updating candidate:', error);
          return new Response(500, {}, { error: 'Failed to update candidate' });
        }
      });

      this.patch('/candidates/:id', (schema, request) => {
        try {
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          console.log('API: Patching candidate', id, 'with data:', attrs);
          
          const candidate = schema.candidates.find(id);
          if (!candidate) {
            console.error('API: Candidate not found:', id);
            return new Response(404, {}, { error: 'Candidate not found' });
          }
          
          candidate.update({
            ...attrs,
            updatedAt: new Date().toISOString(),
            // Ensure arrays are properly handled
            experience: attrs.experience || candidate.experience || [],
            education: attrs.education || candidate.education || [],
            skills: attrs.skills || candidate.skills || []
          });
          
          console.log('API: Candidate patched successfully:', candidate);
          return candidate;
        } catch (error) {
          console.error('API: Error patching candidate:', error);
          return new Response(500, {}, { error: 'Failed to update candidate' });
        }
      });

      this.patch('/candidates/bulk', (schema, request) => {
        try {
          const { candidateIds, updates } = JSON.parse(request.requestBody);
          console.log('API: Bulk updating candidates:', candidateIds, 'with data:', updates);
          
          const results = candidateIds.map(id => {
            try {
              const candidate = schema.candidates.find(id);
              if (!candidate) {
                return { id, success: false, error: 'Candidate not found' };
              }
              
              candidate.update({
                ...updates,
                updatedAt: new Date().toISOString(),
                // Ensure arrays are properly handled
                experience: updates.experience || candidate.experience || [],
                education: updates.education || candidate.education || [],
                skills: updates.skills || candidate.skills || []
              });
              
              return { id, success: true, candidate: candidate.attrs };
            } catch (error) {
              return { id, success: false, error: error.message };
            }
          });
          
          console.log('API: Bulk update completed:', results);
          return { results };
        } catch (error) {
          console.error('API: Error in bulk update:', error);
          return new Response(500, {}, { error: 'Failed to bulk update candidates' });
        }
      });

      this.delete('/candidates/:id', (schema, request) => {
        try {
          const id = request.params.id;
          console.log('API: Deleting candidate:', id);
          
          const candidate = schema.candidates.find(id);
          if (!candidate) {
            console.error('API: Candidate not found:', id);
            return new Response(404, {}, { error: 'Candidate not found' });
          }
          
          candidate.destroy();
          console.log('API: Candidate deleted successfully');
          return new Response(204);
        } catch (error) {
          console.error('API: Error deleting candidate:', error);
          return new Response(500, {}, { error: 'Failed to delete candidate' });
        }
      });

      this.get('/candidates/:id/timeline', (schema, request) => {
        try {
          const candidateId = request.params.id;
          console.log('API: Fetching timeline for candidate:', candidateId);
          
          const candidate = schema.candidates.find(candidateId);
          if (!candidate) {
            console.error('API: Candidate not found:', candidateId);
            return new Response(404, {}, { error: 'Candidate not found' });
          }
          
          // Mock timeline data for now - in a real app this would come from a timeline table
          const timeline = [
            {
              id: 1,
              candidateId: parseInt(candidateId),
              fromStage: null,
              toStage: 'Applied',
              timestamp: candidate.createdAt,
              notes: 'Application submitted',
              type: 'stage_change'
            },
            {
              id: 2,
              candidateId: parseInt(candidateId),
              fromStage: 'Applied',
              toStage: candidate.stage,
              timestamp: candidate.updatedAt,
              notes: candidate.stageChangeNotes || `Moved to ${candidate.stage}`,
              type: 'stage_change'
            }
          ].filter(item => item.fromStage !== item.toStage); // Remove duplicate stages
          
          console.log('API: Returning timeline:', timeline);
          return { timeline };
        } catch (error) {
          console.error('API: Error fetching timeline:', error);
          return new Response(500, {}, { error: 'Failed to fetch candidate timeline' });
        }
      });

      // Assessments routes
      this.get('/assessments', (schema) => {
        console.log('API: Fetching assessments');
        const assessments = schema.assessments.all().models;
        console.log('API: Returning assessments:', assessments.length);
        return { assessments };
      });

      this.get('/assessments/:id', (schema, request) => {
        const id = request.params.id;
        console.log('API: Fetching assessment:', id);
        
        const assessment = schema.assessments.find(id);
        if (!assessment) {
          console.error('API: Assessment not found:', id);
          return new Response(404, {}, { error: 'Assessment not found' });
        }
        
        console.log('API: Assessment found:', assessment);
        return assessment;
      });

      this.post('/assessments', (schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody);
          console.log('API: Creating assessment with data:', attrs);
          
          const assessment = schema.assessments.create({
            ...attrs,
            id: attrs.id || Date.now(),
            createdAt: attrs.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
          console.log('API: Assessment created successfully:', assessment);
          return assessment;
        } catch (error) {
          console.error('API: Error creating assessment:', error);
          return new Response(500, {}, { error: 'Failed to create assessment' });
        }
      });

      this.put('/assessments/:id', (schema, request) => {
        try {
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          console.log('API: Updating assessment', id, 'with data:', attrs);
          
          const assessment = schema.assessments.find(id);
          if (!assessment) {
            console.error('API: Assessment not found:', id);
            return new Response(404, {}, { error: 'Assessment not found' });
          }
          
          assessment.update({
            ...attrs,
            updatedAt: new Date().toISOString()
          });
          
          console.log('API: Assessment updated successfully:', assessment);
          return assessment;
        } catch (error) {
          console.error('API: Error updating assessment:', error);
          return new Response(500, {}, { error: 'Failed to update assessment' });
        }
      });

      this.delete('/assessments/:id', (schema, request) => {
        try {
          const id = request.params.id;
          console.log('API: Deleting assessment:', id);
          
          const assessment = schema.assessments.find(id);
          if (!assessment) {
            console.error('API: Assessment not found:', id);
            return new Response(404, {}, { error: 'Assessment not found' });
          }
          
          assessment.destroy();
          console.log('API: Assessment deleted successfully');
          return new Response(204);
        } catch (error) {
          console.error('API: Error deleting assessment:', error);
          return new Response(500, {}, { error: 'Failed to delete assessment' });
        }
      });
    }
  });
}
