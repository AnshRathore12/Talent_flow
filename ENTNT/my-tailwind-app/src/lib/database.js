import Dexie from 'dexie';

export const db = new Dexie('TalentFlowDB');

db.version(3).stores({
  companies: '++id, name, logo, industry, size, createdAt, updatedAt',
  jobs: '++id, companyId, title, slug, status, tags, order, createdAt, updatedAt',
  candidates: '++id, name, email, phone, location, title, stage, jobId, source, rating, status, createdAt, updatedAt',
  candidateTimeline: '++id, candidateId, fromStage, toStage, timestamp, notes',
  assessments: '++id, companyId, jobId, title, description, questions, status, createdAt, updatedAt, launchedAt',
  assessmentResponses: '++id, assessmentId, candidateId, responses, submittedAt'
});

// Database service functions
export const dbService = {
  // Companies
  async getAllCompanies() {
    return await db.companies.toArray();
  },

  async getCompanyById(id) {
    return await db.companies.get(id);
  },

  async createCompany(company) {
    return await db.companies.add({
      ...company,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  // Jobs
  async getAllJobs() {
    return await db.jobs.orderBy('order').toArray();
  },

  async getJobById(id) {
    return await db.jobs.get(id);
  },

  async addJob(job) {
    return await db.jobs.add({
      ...job,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateJob(id, updates) {
    return await db.jobs.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteJob(id) {
    return await db.jobs.delete(id);
  },

  // Candidates
  async getAllCandidates() {
    return await db.candidates.orderBy('createdAt').reverse().toArray();
  },

  async getCandidateById(id) {
    return await db.candidates.get(id);
  },

  async getCandidatesByJobId(jobId) {
    return await db.candidates.where('jobId').equals(jobId).toArray();
  },

  async getCandidatesByStage(stage) {
    return await db.candidates.where('stage').equals(stage).toArray();
  },

  async searchCandidates(query) {
    const candidates = await db.candidates.toArray();
    const lowercaseQuery = query.toLowerCase();
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(lowercaseQuery) ||
      candidate.email.toLowerCase().includes(lowercaseQuery) ||
      candidate.title.toLowerCase().includes(lowercaseQuery) ||
      (candidate.skills && candidate.skills.some(skill => 
        skill.toLowerCase().includes(lowercaseQuery)
      )) ||
      (candidate.location && candidate.location.toLowerCase().includes(lowercaseQuery))
    );
  },

  async addCandidate(candidate) {
    const newCandidate = {
      ...candidate,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: candidate.status || 'Active'
    };
    
    const id = await db.candidates.add(newCandidate);
    
    // Add initial timeline entry
    await db.candidateTimeline.add({
      candidateId: id,
      fromStage: null,
      toStage: candidate.stage || 'Applied',
      timestamp: new Date(),
      notes: 'Candidate application received'
    });
    
    return id;
  },

  async updateCandidate(id, updates) {
    const currentCandidate = await db.candidates.get(id);
    
    if (!currentCandidate) {
      throw new Error('Candidate not found');
    }
    
    // Record stage change in timeline
    if (updates.stage && updates.stage !== currentCandidate.stage) {
      await db.candidateTimeline.add({
        candidateId: id,
        fromStage: currentCandidate.stage,
        toStage: updates.stage,
        timestamp: new Date(),
        notes: updates.stageChangeNotes || `Stage changed from ${currentCandidate.stage} to ${updates.stage}`
      });
    }
    
    const updatedData = {
      ...updates,
      updatedAt: new Date()
    };
    
    // Remove stageChangeNotes from the actual candidate data
    delete updatedData.stageChangeNotes;
    
    await db.candidates.update(id, updatedData);
    
    return await db.candidates.get(id);
  },

  async deleteCandidate(id) {
    // Also delete related timeline entries
    await db.candidateTimeline.where('candidateId').equals(id).delete();
    return await db.candidates.delete(id);
  },

  async bulkUpdateCandidates(candidateIds, updates) {
    const results = [];
    for (const id of candidateIds) {
      try {
        const result = await this.updateCandidate(id, updates);
        results.push({ id, success: true, data: result });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }
    return results;
  },

  async getCandidateStats() {
    const candidates = await db.candidates.toArray();
    const stats = {
      total: candidates.length,
      byStage: {},
      byJobId: {},
      byStatus: {},
      recentApplications: candidates.filter(c => {
        const createdAt = new Date(c.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt > weekAgo;
      }).length
    };

    candidates.forEach(candidate => {
      // Count by stage
      stats.byStage[candidate.stage] = (stats.byStage[candidate.stage] || 0) + 1;
      
      // Count by job
      stats.byJobId[candidate.jobId] = (stats.byJobId[candidate.jobId] || 0) + 1;
      
      // Count by status
      stats.byStatus[candidate.status] = (stats.byStatus[candidate.status] || 0) + 1;
    });

    return stats;
  },

  async getCandidateTimeline(candidateId) {
    return await db.candidateTimeline
      .where('candidateId')
      .equals(candidateId)
      .orderBy('timestamp')
      .toArray();
  },

  // Assessments
  async getAllAssessments(companyId = 1) {
    // For now, get all assessments and filter in memory since indexing is causing issues
    const allAssessments = await db.assessments.toArray();
    return allAssessments.filter(assessment => assessment.companyId === companyId).reverse();
  },

  async getAssessmentById(id) {
    return await db.assessments.get(id);
  },

  async getAssessmentByJobId(jobId) {
    return await db.assessments.where('jobId').equals(jobId).first();
  },

  async createAssessment(assessment) {
    return await db.assessments.add({
      ...assessment,
      companyId: assessment.companyId || 1, // Default to company 1
      status: assessment.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateAssessment(id, updates) {
    return await db.assessments.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteAssessment(id) {
    return await db.assessments.delete(id);
  },

  async launchAssessment(id) {
    return await db.assessments.update(id, {
      status: 'active',
      launchedAt: new Date(),
      updatedAt: new Date()
    });
  },

  async saveAssessment(assessment) {
    const existing = await db.assessments.where('jobId').equals(assessment.jobId).first();
    
    if (existing) {
      return await db.assessments.update(existing.id, {
        ...assessment,
        updatedAt: new Date()
      });
    } else {
      return await db.assessments.add({
        ...assessment,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  },

  async submitAssessmentResponse(response) {
    return await db.assessmentResponses.add({
      ...response,
      submittedAt: new Date()
    });
  }
};

// Seed data
export const seedData = async () => {
  const jobCount = await db.jobs.count();
  const candidateCount = await db.candidates.count();
  const assessmentCount = await db.assessments.count();
  
  // Only seed if database is completely empty
  if (jobCount > 0 || candidateCount > 0 || assessmentCount > 0) {
    console.log(`Database already has data: ${jobCount} jobs, ${candidateCount} candidates, ${assessmentCount} assessments`);
    return; // Don't overwrite existing data
  }

  console.log('Database is empty, seeding initial data...');
  
  // Seed companies first
  console.log('Adding companies...');
  const companies = [
    {
      name: 'TechFlow Solutions',
      logo: '/api/placeholder/150/50',
      industry: 'Technology',
      size: 'Medium (50-200 employees)',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  await db.companies.bulkAdd(companies);
  console.log('Successfully added companies');

  // Seed candidates only if database is completely empty
  console.log('Adding initial candidate data...');
  
  // Import and use 1000 dummy candidates
  const { thousandCandidates } = await import('../mocks/thousandCandidates.js');
  await db.candidates.bulkAdd(thousandCandidates);
  console.log(`Successfully added ${thousandCandidates.length} candidates`);

  // Seed jobs only if not already present
  const jobs = [];
  const jobTitles = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Data Scientist', 'Product Manager',
    'UI/UX Designer', 'QA Engineer', 'Mobile Developer',
    'Machine Learning Engineer', 'System Administrator', 'Security Engineer',
    'Technical Writer', 'Database Administrator', 'Cloud Architect',
    'Software Architect', 'Scrum Master', 'Business Analyst',
    'Project Manager', 'Sales Engineer', 'Customer Success Manager',
    'Marketing Manager', 'HR Specialist', 'Finance Analyst', 'Operations Manager'
  ];

  const skillSets = [
    ['React', 'JavaScript', 'CSS'], ['Node.js', 'Express', 'MongoDB'],
    ['Python', 'Django', 'PostgreSQL'], ['AWS', 'Docker', 'Kubernetes'],
    ['Python', 'TensorFlow', 'Pandas'], ['Strategy', 'Analytics', 'Roadmaps'],
    ['Figma', 'Sketch', 'Design Systems'], ['Selenium', 'Jest', 'Cypress'],
    ['React Native', 'iOS', 'Android'], ['PyTorch', 'Scikit-learn', 'AI']
  ];

  for (let i = 0; i < 25; i++) {
    const title = jobTitles[i % jobTitles.length];
    jobs.push({
      companyId: 1, // Reference to TechFlow Solutions
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + (i + 1),
      status: Math.random() > 0.3 ? 'active' : 'archived',
      tags: skillSets[i % skillSets.length],
      order: i,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }

  await db.jobs.bulkAdd(jobs);

  // Seed assessments as well
  const assessments = [
    {
      jobId: 1,
      companyId: 1,
      title: 'Frontend Developer Technical Assessment',
      description: 'Comprehensive evaluation of React, JavaScript, and CSS skills for frontend development positions',
      status: 'draft',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'Which hook is used to manage state in functional React components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 'useState',
          required: true,
          points: 2
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What is the purpose of the Virtual DOM in React?',
          options: ['Direct DOM manipulation', 'Performance optimization', 'State management', 'Event handling'],
          correctAnswer: 'Performance optimization',
          required: true,
          points: 2
        },
        {
          id: 3,
          type: 'text',
          question: 'Explain the difference between controlled and uncontrolled components in React. Provide an example of each.',
          correctAnswer: '',
          required: true,
          points: 5
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'Which CSS property is used to create a flexbox container?',
          options: ['display: flex', 'flex-direction: row', 'justify-content: center', 'align-items: center'],
          correctAnswer: 'display: flex',
          required: true,
          points: 1
        },
        {
          id: 5,
          type: 'yes-no',
          question: 'Can you use async/await with React useEffect hook directly?',
          correctAnswer: 'No',
          required: true,
          points: 2
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      jobId: 2,
      companyId: 1,
      title: 'Backend Developer Node.js Assessment',
      description: 'Technical evaluation focusing on Node.js, databases, and API development skills',
      status: 'draft',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the primary purpose of middleware in Express.js?',
          options: ['Database connection', 'Request/response processing', 'File handling', 'Authentication only'],
          correctAnswer: 'Request/response processing',
          required: true,
          points: 2
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'Which method is used to handle asynchronous operations in Node.js?',
          options: ['Callbacks only', 'Promises only', 'Async/await only', 'All of the above'],
          correctAnswer: 'All of the above',
          required: true,
          points: 2
        },
        {
          id: 3,
          type: 'text',
          question: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?',
          correctAnswer: '',
          required: true,
          points: 5
        },
        {
          id: 4,
          type: 'numeric',
          question: 'What is the default port number for MongoDB?',
          correctAnswer: '27017',
          required: true,
          points: 1
        },
        {
          id: 5,
          type: 'multiple-choice',
          question: 'Which HTTP status code indicates a successful POST request that created a new resource?',
          options: ['200', '201', '204', '301'],
          correctAnswer: '201',
          required: true,
          points: 2
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      jobId: 3,
      companyId: 1,
      title: 'Full Stack Developer Comprehensive Assessment',
      description: 'End-to-end evaluation covering frontend, backend, and system design capabilities',
      status: 'draft',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the main advantage of Server-Side Rendering (SSR) over Client-Side Rendering (CSR)?',
          options: ['Better SEO and initial load performance', 'Simpler development', 'Lower server costs', 'Better security'],
          correctAnswer: 'Better SEO and initial load performance',
          required: true,
          points: 3
        },
        {
          id: 2,
          type: 'text',
          question: 'Design a simple REST API for a blog application. Include endpoints for posts and comments with proper HTTP methods.',
          correctAnswer: '',
          required: true,
          points: 8
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Which authentication method is most secure for APIs?',
          options: ['Basic Auth', 'API Keys', 'JWT with refresh tokens', 'Session cookies'],
          correctAnswer: 'JWT with refresh tokens',
          required: true,
          points: 3
        },
        {
          id: 4,
          type: 'text',
          question: 'Explain the concept of microservices architecture and its benefits over monolithic architecture.',
          correctAnswer: '',
          required: true,
          points: 6
        },
        {
          id: 5,
          type: 'yes-no',
          question: 'Is it a good practice to store sensitive data like passwords in plain text in a database?',
          correctAnswer: 'No',
          required: true,
          points: 1
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      jobId: 4,
      companyId: 1,
      title: 'UI/UX Designer Portfolio Assessment',
      description: 'Creative and technical evaluation of design skills, user experience principles, and design tools proficiency',
      status: 'draft',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the primary goal of user experience (UX) design?',
          options: ['Make interfaces look beautiful', 'Solve user problems effectively', 'Follow design trends', 'Reduce development time'],
          correctAnswer: 'Solve user problems effectively',
          required: true,
          points: 2
        },
        {
          id: 2,
          type: 'text',
          question: 'Describe your design process from initial user research to final prototype delivery. Include key methodologies you use.',
          correctAnswer: '',
          required: true,
          points: 8
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Which design principle helps users understand where they are in an application?',
          options: ['Consistency', 'Feedback', 'Affordance', 'Visibility'],
          correctAnswer: 'Visibility',
          required: true,
          points: 2
        },
        {
          id: 4,
          type: 'text',
          question: 'How would you approach designing a mobile app for elderly users? Consider accessibility and usability.',
          correctAnswer: '',
          required: true,
          points: 6
        },
        {
          id: 5,
          type: 'multiple-choice',
          question: 'What is the recommended minimum touch target size for mobile interfaces?',
          options: ['24px', '32px', '44px', '56px'],
          correctAnswer: '44px',
          required: true,
          points: 2
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      jobId: 5,
      companyId: 1,
      title: 'Product Manager Strategic Assessment',
      description: 'Comprehensive evaluation of product strategy, stakeholder management, and analytical thinking skills',
      status: 'draft',
      questions: [
        {
          id: 1,
          type: 'text',
          question: 'You notice a 20% drop in user engagement. Walk me through your process to identify the root cause and propose solutions.',
          correctAnswer: '',
          required: true,
          points: 10
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What is the most important metric for a subscription-based product?',
          options: ['Monthly Active Users', 'Customer Acquisition Cost', 'Customer Lifetime Value', 'Churn Rate'],
          correctAnswer: 'Customer Lifetime Value',
          required: true,
          points: 3
        },
        {
          id: 3,
          type: 'text',
          question: 'How would you prioritize features when you have limited engineering resources and multiple stakeholder demands?',
          correctAnswer: '',
          required: true,
          points: 8
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: 'Which framework is best for feature prioritization?',
          options: ['RICE', 'MOSCOW', 'Kano Model', 'All can be effective depending on context'],
          correctAnswer: 'All can be effective depending on context',
          required: true,
          points: 3
        },
        {
          id: 5,
          type: 'text',
          question: 'Describe how you would conduct user research for a new feature. Include methods and success metrics.',
          correctAnswer: '',
          required: true,
          points: 6
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.assessments.bulkAdd(assessments);

  console.log('Database seeded successfully!');
};

// Force re-seed all data (useful for development)
export const forceSeedAll = async () => {
  console.log('Force clearing and seeding all data...');
  
  // Clear all tables
  await db.companies.clear();
  await db.jobs.clear();
  await db.candidates.clear();
  await db.candidateTimeline.clear();
  await db.assessments.clear();
  await db.assessmentResponses.clear();
  
  // Call the main seed function
  await seedData();
  
  console.log('Successfully force seeded all data!');
};
