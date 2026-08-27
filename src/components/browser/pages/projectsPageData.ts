export interface ProjectResult {
  title: string;
  description: string;
  technologies: string[];
  displayUrl: string;
  highlight?: string;
  note?: string;
  slug?: string;
  detailSections?: {
    label: string;
    items: string[];
  }[];
}

export const DEFAULT_QUERY = "Manushri Muruga Kumar's projects";
export const SEARCH_NAME_PREFIX = 'Manushri Muruga Kumar';

export const PROJECTS: ProjectResult[] = [
  {
    title: 'PawPal AI - RAG-Based Pet Health Record & Reminder Assistant',
    slug: 'pawpal-ai',
    highlight: 'Source-grounded AI health records with human-approved reminders',
    description:
      'PawPal AI transforms veterinary documents into verified, source-grounded pet health records using RAG and a multi-step AI agent. It combines LLM-based document understanding with deterministic validation, human approval, contradiction detection, and reliable reminder generation.',
    technologies: [
      'Python',
      'Streamlit',
      'RAG',
      'LLM Agents',
      'Claude / Anthropic API',
      'Pydantic',
      'SQLite',
      'Pytest',
      'Vector Search',
      'Cosine Similarity',
      'Feature-Hashing Embeddings',
      'Prompt Guardrails',
      'Human-in-the-Loop AI',
    ],
    detailSections: [
      {
        label: 'Core features',
        items: ['Document ingestion', 'Evidence grounding', 'Human review', 'Reminder engine'],
      },
      {
        label: 'Engineering',
        items: ['118 automated tests', '17/17 reliability evaluation cases passing'],
      },
    ],
    displayUrl: 'www.moongle.com/manushri/projects/pawpal-ai',
  },
  {
    title: 'Collegiate — AI-Powered College & Career Planning Platform',
    highlight: 'Client-sponsored full-stack project',
    description:
      'Contributed to account-management workflows, authentication-related features, database-backed functionality, API integration, search pagination, and cross-stack debugging across the frontend and backend.',
    technologies: ['React', 'TypeScript', 'Python', 'Flask', 'Supabase', 'SQL', 'REST APIs', 'Docker'],
    displayUrl: 'www.moongle.com/manushri/projects/collegiate',
    note: 'Source code is client-owned; project details are presented at a high level.',
  },
  {
    title: 'Evexia — Healthcare Data Transparency Platform',
    highlight: '3rd Place — ScaleU + Principled Innovation Academy Hackathon 2026',
    description:
      'Contributed to backend development, API integration, and system architecture for a healthcare transparency platform that helps users understand what providers may infer from their medical records before they provide consent.',
    technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Supabase', 'Drizzle ORM', 'Cloudflare Workers', 'AI APIs'],
    displayUrl: 'www.moongle.com/manushri/projects/evexia',
  },
  {
    title: 'Censend — AI-Powered Professional Communication Extension',
    description:
      'Developed a Chrome extension that analyzes Gmail drafts in real time, identifies unclear or potentially unprofessional wording, and provides context-aware suggestions before messages are sent.',
    technologies: ['JavaScript', 'Chrome Extensions API', 'OpenAI API', 'Gmail DOM Integration'],
    displayUrl: 'www.moongle.com/manushri/projects/censend',
  },
  {
    title: 'Graph Search Engine & Software Testing Framework',
    description:
      'Built a Java graph-processing framework supporting graph parsing, node and edge modification, BFS, DFS, random walk, DOT export, automated testing, and continuous integration. Applied reusable search interfaces and object-oriented design patterns to organize traversal behavior.',
    technologies: ['Java', 'Maven', 'JUnit', 'GitHub Actions', 'DOT'],
    detailSections: [
      {
        label: 'Concepts',
        items: ['BFS', 'DFS', 'Strategy Pattern', 'Template Method Pattern'],
      },
    ],
    displayUrl: 'www.moongle.com/manushri/projects/graph-search-engine',
  },
  {
    title: 'ASP.NET Service-Oriented Personal Dashboard',
    description:
      'Developed a database-backed dashboard with authentication, role-based access control, session management, event workflows, external API integration, and modular backend services.',
    technologies: ['C#', 'ASP.NET Core', 'SQL Server', 'REST APIs'],
    detailSections: [
      {
        label: 'Concepts',
        items: ['Authentication', 'Role-Based Access Control', 'Service-Oriented Architecture'],
      },
    ],
    displayUrl: 'www.moongle.com/manushri/projects/personal-dashboard',
  },
  {
    title: 'Project Management Database System',
    description:
      'Designed a normalized relational database supporting employees, managers, projects, billing, timesheets, reports, and bug-tracking workflows, with an emphasis on referential integrity and practical business relationships.',
    technologies: ['MySQL', 'SQL'],
    detailSections: [
      {
        label: 'Concepts',
        items: ['ER Modeling', 'Normalization', 'Relational Database Design'],
      },
    ],
    displayUrl: 'www.moongle.com/manushri/projects/project-management-database',
  },
  {
    title: 'AI-Assisted Debugging & Testing Project',
    description:
      'Investigated reproducible bugs in a Python application, refactored tightly coupled logic, separated responsibilities, added pytest coverage, and critically reviewed AI-generated code for incorrect assumptions and unreliable behavior.',
    technologies: ['Python', 'Streamlit', 'pytest', 'Git'],
    displayUrl: 'www.moongle.com/manushri/projects/ai-debugging-testing',
  },
  {
    title: 'Website Redesign & User Research Case Study',
    description:
      'Conducted user research and task-based usability testing, created Figma prototypes, and analyzed survey and behavioral data to redesign an existing website around observed user problems.',
    technologies: [],
    detailSections: [
      {
        label: 'Tools and methods',
        items: ['Figma', 'Usability Testing', 'User Research', 'Survey Analysis', 'Data Analysis'],
      },
    ],
    displayUrl: 'www.moongle.com/manushri/projects/website-redesign',
  },
  {
    title: 'ApplyAide — Full-Stack Job Application Assistant',
    highlight: 'Production browser extension and web platform',
    description:
      'Built a Manifest V3 browser extension and React web application that analyzes job postings, assists with application autofill, manages reusable profile information, and tracks saved applications in user-configured Google Sheets.',
    technologies: [
      'TypeScript',
      'React',
      'Vite',
      'AWS Lambda',
      'API Gateway',
      'DynamoDB',
      'S3',
      'CloudFront',
      'Google OAuth 2.0',
      'Google Sheets API',
      'GitHub Actions',
      'Chrome/Edge Extension APIs',
    ],
    detailSections: [
      {
        label: 'Core features',
        items: ['Job Posting Analysis', 'Autofill', 'Profile Sync', 'Spreadsheet Mapping', 'Duplicate Prevention'],
      },
      {
        label: 'Cloud architecture',
        items: ['Serverless AWS Backend', 'Secure Sessions', 'OAuth Token Storage', 'CI/CD'],
      },
    ],
    displayUrl: 'www.moongle.com/manushri/projects/applyaide',
  },
];

export const navLinks = [
  { label: 'Web', query: DEFAULT_QUERY },
  { label: 'Images', query: 'Manushri Muruga Kumar portfolio photos' },
  { label: 'Groups', query: 'Manushri Muruga Kumar teams hackathons collaborations' },
  { label: 'News', query: 'Manushri Muruga Kumar recent milestones and updates' },
  { label: 'Froogle', query: 'Manushri Muruga Kumar products and prototypes' },
  { label: 'Local', query: 'Manushri Muruga Kumar Arizona software engineer' },
  { label: 'more >>', query: 'Manushri Muruga Kumar films projects experience contact' },
] as const;

export const utilityLinks = [
  { label: 'Advanced Search', query: '"Manushri Muruga Kumar" full-stack backend AI filmmaking' },
  { label: 'Preferences', query: 'Manushri Muruga Kumar preferred roles and technologies' },
] as const;

export const popularSearches = [
  'React',
  'TypeScript',
  'Python',
  'Full-Stack',
  'Backend',
  'Artificial Intelligence',
  'Databases',
  'Testing',
  'AWS',
  'Browser Extensions',
] as const;

export const popularSearchFilters: Record<(typeof popularSearches)[number], string[]> = {
  React: ['react'],
  TypeScript: ['typescript'],
  Python: ['python'],
  'Full-Stack': ['full-stack', 'full stack'],
  Backend: ['backend', 'api', 'server'],
  'Artificial Intelligence': ['ai', 'artificial intelligence', 'openai'],
  Databases: ['database', 'databases', 'sql', 'mysql', 'postgresql', 'supabase', 'drizzle'],
  Testing: ['testing', 'test', 'tests', 'pytest', 'junit', 'usability'],
  AWS: ['aws', 'cloud', 'cloudflare'],
  'Browser Extensions': ['extension', 'extensions', 'chrome', 'edge', 'manifest'],
};
