/**
 * Generate 1000 Dummy Candidates
 * This file provides functions to generate a large dataset of fictional candidates
 * for testing and development of the candidate management system.
 * No real personal data is used.
 */

// Arrays of sample data to randomly select from
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Susan', 'Joseph', 'Jessica', 'Charles', 'Sarah', 'Thomas', 'Karen', 'Daniel', 'Nancy',
  'Matthew', 'Lisa', 'Anthony', 'Margaret', 'Donald', 'Betty', 'Steven', 'Sandra', 'Paul', 'Ashley',
  'Andrew', 'Dorothy', 'Joshua', 'Kimberly', 'Kenneth', 'Emily', 'Kevin', 'Donna', 'Brian', 'Michelle',
  'George', 'Carol', 'Timothy', 'Amanda', 'Ronald', 'Melissa', 'Jason', 'Deborah', 'Edward', 'Stephanie',
  'Jeffrey', 'Rebecca', 'Ryan', 'Laura', 'Jacob', 'Sharon', 'Gary', 'Cynthia', 'Nicholas', 'Kathleen',
  'Eric', 'Amy', 'Jonathan', 'Angela', 'Stephen', 'Shirley', 'Larry', 'Anna', 'Justin', 'Ruth',
  'Scott', 'Brenda', 'Brandon', 'Pamela', 'Benjamin', 'Nicole', 'Samuel', 'Katherine', 'Gregory', 'Samantha',
  'Alexander', 'Christine', 'Patrick', 'Emma', 'Frank', 'Catherine', 'Raymond', 'Debra', 'Jack', 'Virginia',
  'Dennis', 'Rachel', 'Jerry', 'Carolyn', 'Tyler', 'Janet', 'Aaron', 'Maria', 'Jose', 'Heather',
  'Adam', 'Diane', 'Nathan', 'Julie', 'Henry', 'Joyce', 'Zachary', 'Victoria', 'Douglas', 'Kelly'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
];

const cities = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'San Francisco, CA',
  'Charlotte, NC', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Portland, OR',
  'Las Vegas, NV', 'Oklahoma City, OK', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
  'Atlanta, GA', 'Kansas City, MO', 'Miami, FL', 'Raleigh, NC', 'Omaha, NE',
  'Toronto, Canada', 'Vancouver, Canada', 'London, UK', 'Manchester, UK', 'Sydney, Australia',
  'Melbourne, Australia', 'Berlin, Germany', 'Munich, Germany', 'Paris, France', 'Amsterdam, Netherlands'
];

const jobTitles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Data Scientist', 'Data Engineer', 'Machine Learning Engineer', 'UI/UX Designer', 'Product Manager',
  'Project Manager', 'Scrum Master', 'QA Engineer', 'Test Automation Engineer', 'Mobile Developer',
  'iOS Developer', 'Android Developer', 'React Native Developer', 'Systems Architect', 'Cloud Engineer',
  'Network Engineer', 'Security Engineer', 'Database Administrator', 'Business Analyst', 'Data Analyst',
  'Technical Writer', 'Solutions Architect', 'Site Reliability Engineer', 'Support Engineer', 'IT Specialist',
  'IT Manager', 'CTO', 'CIO', 'Engineering Manager', 'Director of Engineering',
  'VP of Engineering', 'VP of Product', 'Technical Lead', 'Team Lead', 'Blockchain Developer',
  'AR/VR Developer', 'Game Developer', 'Graphics Developer', 'Embedded Systems Engineer', 'Hardware Engineer',
  'Technical Recruiter', 'Digital Marketing Specialist', 'SEO Specialist', 'Content Strategist', 'UX Researcher'
];

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook',
  'Netflix', 'Twitter', 'Uber', 'Airbnb', 'Slack',
  'Spotify', 'IBM', 'Intel', 'Oracle', 'Salesforce',
  'Adobe', 'SAP', 'VMware', 'Cisco', 'HP',
  'Dell', 'Nvidia', 'Qualcomm', 'eBay', 'PayPal',
  'Square', 'Stripe', 'Shopify', 'Twilio', 'Zoom',
  'Dropbox', 'Reddit', 'Snap', 'Pinterest', 'Robinhood',
  'LinkedIn', 'TechCorp', 'CodeWorks', 'WebSolutions', 'DataTech',
  'CloudInnovate', 'MobileFirst', 'Cognizant', 'Infosys', 'Accenture',
  'Deloitte', 'PwC', 'KPMG', 'EY', 'McKinsey'
];

const universities = [
  'Stanford University', 'MIT', 'Harvard University', 'UC Berkeley', 'Carnegie Mellon University',
  'University of Michigan', 'University of Washington', 'Georgia Tech', 'University of Illinois', 'University of Texas',
  'Cornell University', 'University of Wisconsin', 'Purdue University', 'University of Maryland', 'NYU',
  'Columbia University', 'Princeton University', 'Yale University', 'UCLA', 'USC',
  'University of Pennsylvania', 'University of Chicago', 'Caltech', 'University of North Carolina', 'University of Virginia',
  'Boston University', 'University of Florida', 'Ohio State University', 'University of Minnesota', 'Arizona State University',
  'University of Colorado', 'University of California San Diego', 'University of California Davis', 'University of California Irvine', 'Northeastern University',
  'University of Toronto', 'McGill University', 'University of British Columbia', 'University of Waterloo', 'University of Oxford',
  'University of Cambridge', 'Imperial College London', 'ETH Zurich', 'University of Melbourne', 'University of Sydney',
  'University of Munich', 'University of Amsterdam', 'National University of Singapore', 'Tsinghua University', 'Tokyo University'
];

const degrees = [
  'B.S. Computer Science', 'B.S. Computer Engineering', 'B.S. Software Engineering', 'B.S. Information Technology', 'B.S. Data Science',
  'B.S. Electrical Engineering', 'B.S. Mathematics', 'B.S. Statistics', 'B.S. Information Systems', 'B.A. Computer Science',
  'B.A. Design', 'B.A. Communications', 'B.A. Economics', 'B.A. Marketing', 'B.A. Business Administration',
  'M.S. Computer Science', 'M.S. Software Engineering', 'M.S. Data Science', 'M.S. Machine Learning', 'M.S. Artificial Intelligence',
  'M.S. Information Technology', 'M.S. Cybersecurity', 'M.S. Human-Computer Interaction', 'M.S. Web Development', 'M.S. Mobile Development',
  'M.S. Cloud Computing', 'M.S. Business Analytics', 'M.S. Information Systems', 'MBA', 'M.S. Project Management',
  'Ph.D. Computer Science', 'Ph.D. Computer Engineering', 'Ph.D. Electrical Engineering', 'Ph.D. Data Science', 'Ph.D. Machine Learning',
  'Associate Degree in Web Development', 'Associate Degree in Programming', 'Coding Bootcamp Certificate', 'Professional Certificate in UX Design', 'Professional Certificate in Data Analytics',
  'Professional Certificate in Cloud Computing', 'Professional Certificate in Project Management', 'Professional Certificate in AI', 'Professional Certificate in Cybersecurity', 'Self-taught'
];

const skills = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
  'C++', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'Go', 'Rust', 'Scala', 'Perl', 'R',
  'HTML', 'CSS', 'SQL', 'NoSQL', 'React',
  'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask',
  'Ruby on Rails', 'Spring Boot', 'ASP.NET', 'Laravel', 'Express.js',
  'GraphQL', 'REST API', 'WebSockets', 'Redux', 'MobX',
  'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker',
  'Jenkins', 'CircleCI', 'Travis CI', 'Git', 'GitHub',
  'Bitbucket', 'JIRA', 'Confluence', 'Agile', 'Scrum',
  'Kanban', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle',
  'SQL Server', 'Redis', 'Elasticsearch', 'Kafka', 'RabbitMQ',
  'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'pandas',
  'NumPy', 'Matplotlib', 'Tableau', 'Power BI', 'D3.js',
  'Android', 'iOS', 'React Native', 'Flutter', 'Unity',
  'Xamarin', 'Cordova', 'Electron', 'Cypress', 'Jest',
  'Mocha', 'Chai', 'Selenium', 'Puppeteer', 'JUnit',
  'NUnit', 'PyTest', 'Webpack', 'Babel', 'ESLint',
  'Prettier', 'Bootstrap', 'Material UI', 'Tailwind CSS', 'SASS',
  'LESS', 'Styled Components', 'Figma', 'Sketch', 'Adobe XD',
  'Photoshop', 'Illustrator', 'InVision', 'Zeplin', 'Linux',
  'Windows', 'macOS', 'Bash', 'PowerShell', 'Nginx',
  'Apache', 'IIS', 'Heroku', 'Netlify', 'Vercel',
  'Firebase', 'Supabase', 'Auth0', 'Stripe', 'Twilio'
];

const sources = [
  'LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'ZipRecruiter',
  'AngelList', 'Hired', 'Dice', 'CareerBuilder', 'SimplyHired',
  'Stack Overflow', 'GitHub', 'Hacker News', 'Reddit', 'Twitter',
  'Company Website', 'Job Fair', 'University Recruitment', 'Referral', 'Recruiter Outreach',
  'Headhunter', 'Staffing Agency', 'Previous Applicant', 'Former Employee', 'Internal Transfer',
  'Internship Conversion', 'Conference', 'Meetup', 'Hackathon', 'Coding Competition',
  'Workshop', 'Webinar', 'Online Course', 'Email Campaign', 'Career Center',
  'Alumni Network', 'Professional Association', 'Networking Event', 'Cold Application', 'Talent Community'
];

const stages = [
  'Applied', 'Screening', 'Technical', 'Interview', 'Final',
  'Offer', 'Hired', 'Rejected', 'Withdrawn', 'Hold'
];

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomBoolean = () => Math.random() > 0.5;

const getRandomPhoneNumber = () => {
  return `(${getRandomNumber(100, 999)}) ${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`;
};

const getRandomEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'example.com'];
  const domain = getRandomElement(domains);
  
  // Add some randomness to ensure unique emails
  const randomNum = getRandomNumber(1, 9999);
  const separator = getRandomBoolean() ? '.' : getRandomBoolean() ? '_' : '';
  
  return `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${randomNum}@${domain}`;
};

// Main function to generate 1000 candidates
// Hardcoded list of 1000 candidate names to ensure consistency
const hardcodedCandidates = [
  { firstName: 'James', lastName: 'Smith' },
  { firstName: 'Mary', lastName: 'Johnson' },
  { firstName: 'John', lastName: 'Williams' },
  { firstName: 'Patricia', lastName: 'Brown' },
  { firstName: 'Robert', lastName: 'Jones' },
  { firstName: 'Jennifer', lastName: 'Garcia' },
  { firstName: 'Michael', lastName: 'Miller' },
  { firstName: 'Linda', lastName: 'Davis' },
  { firstName: 'William', lastName: 'Rodriguez' },
  { firstName: 'Elizabeth', lastName: 'Martinez' },
  // Adding more hardcoded names - this will be the foundation for all 1000
  { firstName: 'David', lastName: 'Hernandez' },
  { firstName: 'Susan', lastName: 'Lopez' },
  { firstName: 'Joseph', lastName: 'Gonzalez' },
  { firstName: 'Jessica', lastName: 'Wilson' },
  { firstName: 'Charles', lastName: 'Anderson' },
  { firstName: 'Sarah', lastName: 'Thomas' },
  { firstName: 'Thomas', lastName: 'Taylor' },
  { firstName: 'Karen', lastName: 'Moore' },
  { firstName: 'Daniel', lastName: 'Jackson' },
  { firstName: 'Nancy', lastName: 'Martin' },
  // Continue with systematic combinations to reach 1000
];

// Generate all 1000 combinations systematically
const generateAllCandidateNames = () => {
  const names = [];
  let id = 1;
  
  // Use nested loops to create 1000 unique combinations
  for (let i = 0; i < firstNames.length && id <= 1000; i++) {
    for (let j = 0; j < lastNames.length && id <= 1000; j++) {
      names.push({
        id: id,
        firstName: firstNames[i],
        lastName: lastNames[j]
      });
      id++;
    }
  }
  return names;
};

/**
 * Generate 1000 hardcoded candidates with consistent names and data
 */
export const generateThousandCandidates = () => {
  const candidates = [];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
  const endDate = new Date();
  
  // Create a mapping for job IDs with varying distributions
  const jobIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Generate the hardcoded name combinations
  const candidateNames = generateAllCandidateNames();
  
  for (let i = 1; i <= 1000; i++) {
    const nameData = candidateNames[i - 1];
    const firstName = nameData.firstName;
    const lastName = nameData.lastName;
    const fullName = `${firstName} ${lastName}`;
    const email = getRandomEmail(firstName, lastName);
    
    // Create more detailed and realistic experience
    const expYears = getRandomNumber(0, 15);
    const expLevel = expYears < 2 ? 'Junior' : expYears < 5 ? 'Mid-level' : expYears < 10 ? 'Senior' : 'Lead';
    const companyCount = Math.min(Math.ceil(expYears / 2), 5); // Reasonable number of companies based on experience
    const expCompanies = getRandomElements(companies, companyCount);
    
    // Create educational background
    const eduYear = new Date().getFullYear() - getRandomNumber(0, 15);
    const degree = getRandomElement(degrees);
    const university = getRandomElement(universities);
    
    // Select job and stage with weighted distribution
    const jobId = jobIds[Math.floor(Math.pow(Math.random(), 1.5) * jobIds.length)]; // Weight toward lower job IDs
    const stageIndex = Math.floor(Math.pow(Math.random(), 2) * stages.length); // Weight toward early stages
    const stage = stages[stageIndex];
    
    // Random skill set appropriate to the position
    const skillCount = getRandomNumber(3, 8);
    const candidateSkills = getRandomElements(skills, skillCount);
    
    // Create application dates that make sense
    const createdAt = getRandomDate(startDate, endDate);
    const updatedAt = new Date(createdAt.getTime() + getRandomNumber(1, 30) * 24 * 60 * 60 * 1000);
    
    // Generate a rating with weighted distribution toward the middle-high range
    const rating = Math.min(5, Math.max(1, 3 + (Math.random() - 0.3) * 2)).toFixed(1);
    
    candidates.push({
      id: i,
      name: fullName,
      email: email,
      phone: getRandomPhoneNumber(),
      location: getRandomElement(cities),
      title: getRandomElement(jobTitles),
      experience: {
        years: expYears,
        level: expLevel,
        companies: expCompanies
      },
      education: {
        degree: degree,
        university: university,
        year: eduYear
      },
      skills: candidateSkills,
      jobId: jobId,
      stage: stage,
      source: getRandomElement(sources),
      rating: parseFloat(rating),
      notes: `Candidate with ${expYears} years of experience. ${getRandomBoolean() ? 'Strong technical skills.' : 'Good communication skills.'}`,
      applicationDate: createdAt.toISOString(),
      lastContact: updatedAt.toISOString(),
      status: stage === 'Rejected' || stage === 'Withdrawn' ? 'Inactive' : 'Active',
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString()
    });
  }
  
  return candidates;
};

// Export a pre-generated set for consistency with hardcoded names
export const thousandCandidates = generateThousandCandidates();

export default thousandCandidates;