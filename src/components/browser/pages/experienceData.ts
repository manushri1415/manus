export interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  dates: string;
  location: string;
  highlights: string[];
  skills?: string[];
  relatedProject?: string;
}

export interface ExperienceCategory {
  id: string;
  label: string;
  entries: ExperienceEntry[];
}

export interface ExperiencePhoto {
  id: string;
  caption: string;
  thumbnail: string;
  alt: string;
}

export const EXPERIENCE_PHOTOS: ExperiencePhoto[] = [
  {
    id: 'capstone-showcase',
    caption: 'Capstone Showcase',
    thumbnail: 'assets/icons/M-photos/capstone-showcase-collegiate.jpeg',
    alt: 'Capstone showcase poster for Collegiate 2.0 platform',
  },
  {
    id: 'camp-counselor',
    caption: 'Camp Counselor',
    thumbnail: 'assets/icons/M-photos/Camp-counselor.jpeg',
    alt: 'STEM camp counselor with students',
  },
  {
    id: 'production-assistant',
    caption: 'Production Assistant',
    thumbnail: 'assets/icons/M-photos/Production-Assistant-AFA.jpeg',
    alt: 'Production assistant on film set',
  },
];

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    id: 'professional',
    label: 'Professional & Technical Experience',
    entries: [
      {
        id: 'collegiate',
        title: 'Full-Stack Developer',
        organization: 'Collegiate AI Platform, Endless Moments LLC',
        dates: 'August 2025 – April 2026',
        location: 'Remote',
        highlights: [
          'Built production full-stack features using TypeScript, React, Python, Flask APIs, Supabase, and SQL',
          'Implemented secure account-management workflows including delete account, password reset, and email-change features',
          'Resolved Supabase RLS issues, configured Brevo SMTP, and deployed frontend updates through Vercel',
          'Collaborated in an Agile team of four to translate client requirements into scoped, production-ready features',
        ],
        skills: 'TypeScript, React, Python, Flask, Supabase, SQL, REST APIs, Docker, Vercel',
        relatedProject: 'View Collegiate on Moongle',
      },
      {
        id: 'adjoaa',
        title: 'AI Product Strategy Intern',
        organization: 'ADJOAA',
        dates: 'March 2026 – May 2026',
        location: 'Remote',
        highlights: [
          'Structured and normalized product data across 25,000+ SKUs and 110+ brands, improving metadata consistency and search visibility',
          'Designed AI-assisted automation workflows using Claude, Shopify, Airtable, and structured prompt libraries',
          'Analyzed traffic, conversion, retention, and competitor data across UK, US, and French markets to identify growth opportunities',
        ],
        skills: 'AI product strategy, Claude, Shopify, Airtable, SEO optimization, data analysis',
      },
    ],
  },
  {
    id: 'campus',
    label: 'Campus & Part-Time Work',
    entries: [
      {
        id: 'vivarium-assistant',
        title: 'Vivarium Assistant',
        organization: 'Department of Animal Care & Technologies, ASU',
        dates: 'August 2024 – May 2026',
        location: 'Tempe, Arizona',
        highlights: [
          'Collaborated with staff across locations to coordinate daily operations, demonstrating reliability, teamwork, and cross-functional communication',
          'Managed schedules, prioritized tasks, and adapted workflows to support efficient lab operations',
        ],
      },
      {
        id: 'sdfc-marketing',
        title: 'Outreach+ Social Media Specialist',
        organization: 'ASU SDFC West Marketing',
        dates: 'March 2023 – December 2025',
        location: 'Glendale, Arizona',
        highlights: [
          'Managed social media accounts (Instagram) for SDFC West Valley campus, creating and curating content to engage with the campus community',
          'Collaborated with other departments and organizations on campus to cross-promote events and share relevant content',
          'Assisted in planning and executing campus events, taking photos and videos for social media coverage',
          'Engaged with first-year students, providing mentorship and guidance on campus resources',
        ],
      },
      {
        id: 'camp-counselor',
        title: 'Summer Camp Counselor (C2)',
        organization: 'Ira A. Fulton Schools of Engineering, ASU',
        dates: 'August 2024 – August 2025',
        location: 'Prescott, Arizona',
        highlights: [
          'Mentored 25–40 first-year engineering students, supporting their academic transition and problem-solving skills',
          'Facilitated group activities, moderated discussions, and guided students toward ASU resources in a collaborative environment',
        ],
      },
    ],
  },
  {
    id: 'additional',
    label: 'Additional Experience',
    entries: [
      {
        id: 'production-assistant',
        title: 'Production Assistant',
        organization: 'Film & Media Production',
        dates: 'January 2023',
        location: 'Arizona',
        highlights: [
          'Communicated with crew members and actors to support production workflows',
          'Organized and coordinated production activities and schedules',
          'Responded to last-minute changes and maintained a calm, collaborative production environment',
        ],
      },
      {
        id: 'changemaker',
        title: 'Volunteer',
        organization: 'Changemaker ASU',
        dates: '[Date pending]',
        location: 'Tempe, Arizona',
        highlights: [
          'Participated in service events supporting community improvement initiatives',
          'Helped organize classrooms and educational spaces for maximum impact',
          'Supported gardening and school-improvement projects with other ASU students',
        ],
      },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    entries: [
      {
        id: 'asu',
        title: 'B.S. Computer Science',
        organization: 'Arizona State University',
        dates: 'August 2022 – July 2026',
        location: 'Tempe, Arizona',
        highlights: [
          'Full-stack development, backend systems, databases, and product engineering focus',
          'Certifications: AI Fluency: Framework & Foundations (Anthropic, July 2026), AWS Cloud Practitioner Essentials (AWS, July 2026)',
        ],
      },
      {
        id: 'sunshine-chennai',
        title: 'Previously studied at Sunshine Chennai Senior Secondary School',
        organization: 'Sunshine Chennai Senior Secondary School',
        dates: '',
        location: 'Chennai, India',
        highlights: [],
      },
    ],
  },
];
