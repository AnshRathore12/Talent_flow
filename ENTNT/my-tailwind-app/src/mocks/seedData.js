import { db, DatabaseService } from '../lib/database.js';

const jobTitles = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Data Scientist', 'Product Manager', 'UX Designer', 'QA Engineer', 'Mobile Developer',
  'Machine Learning Engineer', 'Technical Writer', 'Security Engineer', 'Database Administrator',
  'Cloud Architect', 'Site Reliability Engineer', 'Business Analyst', 'Scrum Master',
  'UI Designer', 'Systems Administrator', 'Network Engineer', 'AI Research Scientist',
  'Blockchain Developer', 'Game Developer', 'IoT Engineer', 'Cybersecurity Analyst'
];

const techTags = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'AWS',
  'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST API', 'Git',
  'CI/CD', 'Agile', 'Scrum', 'Machine Learning', 'TensorFlow', 'Vue.js', 'Angular',
  'Spring Boot', 'Django', 'Flask', 'Redis', 'Elasticsearch', 'Microservices'
];

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Robert', 'Amanda',
  'James', 'Jessica', 'William', 'Ashley', 'Daniel', 'Brittany', 'Matthew', 'Samantha',
  'Anthony', 'Jennifer', 'Mark', 'Elizabeth', 'Paul', 'Laura', 'Steven', 'Michelle'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez'
];

const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

const assessmentQuestions = {
  technical: [
    {
      id: 1,
      question: "What is the difference between let, const, and var in JavaScript?",
      type: "text",
      required: true
    },
    {
      id: 2,
      question: "Explain the concept of closures in JavaScript with an example.",
      type: "text",
      required: true
    },
    {
      id: 3,
      question: "What is your experience with React hooks?",
      type: "multiple-choice",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
      required: true
    },
    {
      id: 4,
      question: "How do you handle state management in large React applications?",
      type: "text",
      required: true
    },
    {
      id: 5,
      question: "What is the purpose of useEffect hook?",
      type: "text",
      required: true
    },
    {
      id: 6,
      question: "Explain the difference between SQL and NoSQL databases.",
      type: "text",
      required: true
    },
    {
      id: 7,
      question: "Which testing frameworks have you used?",
      type: "multiple-choice",
      options: ["Jest", "Mocha", "Cypress", "React Testing Library", "None"],
      required: false
    },
    {
      id: 8,
      question: "How do you optimize website performance?",
      type: "text",
      required: true
    },
    {
      id: 9,
      question: "What is your preferred CSS methodology?",
      type: "multiple-choice",
      options: ["BEM", "OOCSS", "SMACSS", "Atomic CSS", "CSS-in-JS"],
      required: false
    },
    {
      id: 10,
      question: "Describe your experience with version control systems.",
      type: "text",
      required: true
    },
    {
      id: 11,
      question: "How do you handle API integration in frontend applications?",
      type: "text",
      required: true
    },
    {
      id: 12,
      question: "What are your thoughts on microservices architecture?",
      type: "text",
      required: false
    }
  ],
  behavioral: [
    {
      id: 1,
      question: "Tell us about a time when you had to work under a tight deadline.",
      type: "text",
      required: true
    },
    {
      id: 2,
      question: "How do you handle conflicts with team members?",
      type: "text",
      required: true
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      type: "text",
      required: true
    },
    {
      id: 4,
      question: "How do you prioritize tasks when you have multiple deadlines?",
      type: "text",
      required: true
    },
    {
      id: 5,
      question: "What motivates you in your work?",
      type: "text",
      required: true
    },
    {
      id: 6,
      question: "How do you stay updated with new technologies?",
      type: "text",
      required: true
    },
    {
      id: 7,
      question: "Describe your ideal work environment.",
      type: "text",
      required: false
    },
    {
      id: 8,
      question: "How do you handle feedback and criticism?",
      type: "text",
      required: true
    },
    {
      id: 9,
      question: "What are your career goals for the next 5 years?",
      type: "text",
      required: true
    },
    {
      id: 10,
      question: "How do you approach learning new technologies or skills?",
      type: "text",
      required: true
    }
  ],
  general: [
    {
      id: 1,
      question: "Why are you interested in this position?",
      type: "text",
      required: true
    },
    {
      id: 2,
      question: "What interests you about our company?",
      type: "text",
      required: true
    },
    {
      id: 3,
      question: "What are your salary expectations?",
      type: "text",
      required: false
    },
    {
      id: 4,
      question: "Are you willing to relocate?",
      type: "multiple-choice",
      options: ["Yes", "No", "Depends on location"],
      required: true
    },
    {
      id: 5,
      question: "What is your preferred work arrangement?",
      type: "multiple-choice",
      options: ["Remote", "Hybrid", "On-site", "Flexible"],
      required: true
    },
    {
      id: 6,
      question: "How did you hear about this position?",
      type: "multiple-choice",
      options: ["Job board", "Company website", "Referral", "Social media", "Other"],
      required: false
    },
    {
      id: 7,
      question: "What questions do you have about the role or company?",
      type: "text",
      required: false
    },
    {
      id: 8,
      question: "When would you be available to start?",
      type: "text",
      required: true
    },
    {
      id: 9,
      question: "Do you have any other offers or interviews in progress?",
      type: "text",
      required: false
    },
    {
      id: 10,
      question: "Is there anything else you'd like us to know about you?",
      type: "text",
      required: false
    }
  ]
};

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingJobs = await db.jobs.count();
    if (existingJobs > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database...');

    // Create 25 jobs
    const jobs = [];
    for (let i = 0; i < 25; i++) {
      const job = {
        title: jobTitles[i],
        slug: jobTitles[i].toLowerCase().replace(/\s+/g, '-'),
        status: Math.random() > 0.3 ? 'active' : 'archived',
        tags: getRandomElements(techTags, Math.floor(Math.random() * 5) + 2),
        order: i + 1
      };
      const createdJob = await DatabaseService.createJob(job);
      jobs.push(createdJob);
    }

    // Create assessments for jobs
    for (let i = 0; i < Math.min(jobs.length, 3); i++) {
      const job = jobs[i];
      const assessmentType = ['technical', 'behavioral', 'general'][i];
      const questions = getRandomElements(assessmentQuestions[assessmentType], 12);
      
      await DatabaseService.createOrUpdateAssessment(job.id, {
        title: `${job.title} Assessment`,
        description: `Assessment for ${job.title} position`,
        questions: questions
      });
    }

    // Create 1000 candidates
    for (let i = 0; i < 1000; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const stage = getRandomElement(stages);
      const jobId = getRandomElement(jobs).id;

      await DatabaseService.createCandidate({
        name: `${firstName} ${lastName}`,
        email: email,
        stage: stage,
        jobId: jobId
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
