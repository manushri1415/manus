export interface SlideshowImage {
  src: string;
  alt: string;
  title: string;
}

export interface DirectorVideo {
  id: string;
  title: string;
  thumbnail: string;
  youtubeUrl: string;
}

export interface FeaturedExperience {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  recognition?: string;
  category: 'hackathon' | 'competition' | 'capstone';
}

export interface RecentComment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
  commentNumber: number;
}

export interface VideoResponse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'film-production' | 'campus-life';
  date?: string;
}

export const SLIDESHOW_IMAGES: SlideshowImage[] = [
  {
    src: 'assets/icons/M-photos/gradpic.jpeg',
    alt: 'Graduation photo at ASU campus with diploma',
    title: 'Graduation Day',
  },
  {
    src: 'assets/icons/M-photos/Manu-profile-pic.jpeg',
    alt: 'Professional headshot',
    title: 'Profile',
  },
  {
    src: 'assets/icons/M-photos/capstone-showcase-collegiate.jpeg',
    alt: 'Capstone showcase poster for Collegiate 2.0 platform',
    title: 'Capstone Showcase',
  },
];

export const DIRECTOR_VIDEOS: DirectorVideo[] = [
  {
    id: 'before-the-code',
    title: 'Before The Code: Childhood in Chennai',
    thumbnail: 'assets/icons/M-photos/Manu-profile-pic.jpeg',
    youtubeUrl: '#childhood-in-chennai',
  },
  {
    id: 'early-creativity',
    title: 'Early Creativity: Classical Dance',
    thumbnail: 'assets/icons/M-photos/acted-in-show-w-AFA.jpeg',
    youtubeUrl: '#early-creativity',
  },
  {
    id: 'from-chennai-to-arizona',
    title: 'My first job ever!!!',
    thumbnail: 'assets/icons/M-photos/my-socialmedia-job-badge.jpeg',
    youtubeUrl: '#from-chennai-to-arizona',
  },
  {
    id: 'building-under-pressure',
    title: 'Building Under Pressure: Hackathons',
    thumbnail: 'assets/icons/M-photos/evexia.png',
    youtubeUrl: '#building-under-pressure',
  },
  {
    id: 'life-on-set',
    title: 'Life On Set: Arizona Film Association',
    thumbnail: 'assets/icons/M-photos/Production-Assistant-AFA.jpeg',
    youtubeUrl: '#life-on-set',
  },
  {
    id: 'now-playing',
    title: 'Capstone Showcase w/ team',
    thumbnail: 'assets/icons/M-photos/capstone-showcase-collegiate.jpeg',
    youtubeUrl: '#now-playing',
  },
];

export const FEATURED_EXPERIENCES: FeaturedExperience[] = [
  {
    id: 'scaleu-hackathon',
    title: 'ScaleU + Principled Innovation Academy Hackathon',
    date: 'February 2–4, 2026',
    description: 'Built Evexia, a healthcare data transparency platform designed to help users understand what providers may infer from medical records before consent.',
    thumbnail: 'assets/icons/M-photos/evexia.png',
    recognition: '3rd Place',
    category: 'hackathon',
  },
  {
    id: 'zoom-hackathon',
    title: 'Zoom Global Emerging Talent Hackathon',
    date: '2022',
    description: 'Participated in this global hackathon, collaborating with emerging tech talent.',
    thumbnail: 'assets/icons/M-photos/zoom2022.jpeg',
    category: 'hackathon',
  },
  {
    id: 'devhacks',
    title: 'DevHacks 2026',
    date: '2026',
    description: 'Participated in DevHacks, a competitive hackathon focused on building solutions that change the world.',
    thumbnail: 'assets/icons/M-photos/censend.jpeg',
    category: 'hackathon',
  },
  {
    id: 'globehack',
    title: 'GlobeHack 2026',
    date: '2026',
    description: 'Joined GlobeHack to build and innovate with a global community of developers.',
    thumbnail: 'assets/icons/M-photos/Globehack.jpeg',
    category: 'hackathon',
  },
  {
    id: 'acel-case-competition',
    title: 'ACEL 2026 Case Competition',
    date: 'Spring 2026',
    description: 'Competed in a rigorous case competition, applying analytical thinking and teamwork to solve complex business problems.',
    thumbnail: 'assets/icons/M-photos/acel.jpg',
    recognition: 'Honorable Mention (Sterling Systems)',
    category: 'competition',
  },
  {
    id: 'collegiate-capstone',
    title: 'Collegiate 2.0 Capstone Showcase',
    date: 'Spring 2026',
    description: 'Showcased Collegiate 2.0, an AI-powered college and career planning platform developed as part of an ASU capstone design project.',
    thumbnail: 'assets/icons/M-photos/capstone-showcase-collegiate.jpeg',
    category: 'capstone',
  },
];

export const RECENT_COMMENTS: RecentComment[] = [
  {
    id: 'comment-1',
    username: 'manushri_2009',
    text: 'Dance practice tomorrow. I definitely practiced and did not spend the evening watching television.',
    timeAgo: '6 years ago',
    commentNumber: 1,
  },
  {
    id: 'comment-2',
    username: 'manushri_m',
    text: 'Hackathons taught me to build before I finish panicking.',
    timeAgo: '2 months ago',
    commentNumber: 2,
  },
  {
    id: 'comment-3',
    username: 'manushri_m',
    text: 'Film sets taught me that being useful is sometimes more important than looking prepared.',
    timeAgo: '2 months ago',
    commentNumber: 3,
  },
  {
    id: 'comment-4',
    username: 'manushri_m',
    text: 'Some of my best ideas started approximately three minutes before a deadline LITERALLY!!',
    timeAgo: '1 month ago',
    commentNumber: 4,
  },
  {
    id: 'comment-5',
    username: 'manushri_2022',
    text: 'Moved across the world to study computer science. This seems reasonable.',
    timeAgo: '1 month ago',
    commentNumber: 5,
  },
  {
    id: 'comment-6',
    username: 'manushri_2026',
    text: 'Graduated. Still deciding whether life is a software project or a film with questionable pacing.',
    timeAgo: '2 weeks ago',
    commentNumber: 6,
  },
];

export const VIDEO_RESPONSES: VideoResponse[] = [
  {
    id: 'safety-season1',
    title: 'Safety — Season 1 Champion',
    description: 'Won Season 1 of the student-made reality show Safety, an Arizona Film Association production.',
    thumbnail: 'assets/icons/M-photos/IMG_0807.jpeg',
    category: 'film-production',
    date: '2023',
  },
  {
    id: 'safety-season2-pa',
    title: 'Production Assistant — Safety Season 2',
    description: 'Worked as a production assistant on Season 2 of Safety. Director: Tyler Kupfer. Camera: Amanda Ames. January 2023.',
    thumbnail: 'assets/icons/M-photos/Production-Assistant-AFA.jpeg',
    category: 'film-production',
    date: 'January 2023',
  },
  {
    id: 'afa-cast',
    title: 'Arizona Film Association Cast Member',
    description: 'Acted in a production with the Arizona Film Association, a creative community focused on student filmmaking.',
    thumbnail: 'assets/icons/M-photos/acted-in-show-w-AFA.jpeg',
    category: 'film-production',
  },
  {
    id: 'camp-counselor',
    title: 'STEM Camp Counselor',
    description: 'Led STEM education and robotics activities at "Rock the Pines," an ASU-affiliated summer camp for young learners.',
    thumbnail: 'assets/icons/M-photos/Camp-counselor.jpeg',
    category: 'campus-life',
  },
  {
    id: 'humane-society',
    title: 'Arizona Humane Society Volunteer',
    description: 'Volunteered with the Arizona Humane Society, supporting animal welfare and community outreach initiatives.',
    thumbnail: 'assets/icons/M-photos/Volunteer-Az-humane-society.jpeg',
    category: 'campus-life',
  },
  {
    id: 'live-well-asu',
    title: 'Social media/Outreach specialist @ASU SDFC West',
    description: 'Created content and managed social media for the "Live Well @ASU" program, promoting campus wellness.',
    thumbnail: 'assets/icons/M-photos/my-socialmedia-job-badge.jpeg',
    category: 'campus-life',
  },
];
