import { useState, useEffect } from 'react';
import './ProjectsPage.css';

interface ProjectResult {
  title: string;
  description: string;
  technologies: string[];
  displayUrl: string;
  featured?: boolean;
  inDevelopment?: boolean;
  clientOwned?: boolean;
}

const PROJECTS: ProjectResult[] = [
  {
    title: 'Collegiate — AI-Powered College & Career Planning Platform',
    description: 'A client-sponsored full-stack platform supporting college and career planning. I contributed to account-management workflows, authentication-related features, database-backed functionality, API integration, pagination, and debugging across the frontend and backend.',
    technologies: ['React', 'TypeScript', 'Python', 'Flask', 'Supabase', 'SQL', 'REST APIs', 'Docker'],
    displayUrl: 'www.moongle.com/manushri/projects/collegiate',
    clientOwned: true,
  },
  {
    title: 'Evexia — Healthcare Data Transparency Platform',
    description: 'A healthcare transparency platform designed to help users understand what providers may infer from medical records before consent. The project placed third at the ScaleU + Principled Innovation Academy Hackathon 2026.',
    technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Supabase', 'Drizzle ORM', 'Cloudflare Workers', 'AI APIs'],
    displayUrl: 'www.moongle.com/manushri/projects/evexia',
    featured: true,
  },
  {
    title: 'Censend — AI-Powered Professional Communication Extension',
    description: 'A Chrome extension that analyzes Gmail drafts and helps users identify unclear, risky, or unprofessional wording before sending messages.',
    technologies: ['JavaScript', 'Chrome Extensions API', 'OpenAI API', 'Gmail DOM Integration'],
    displayUrl: 'www.moongle.com/manushri/projects/censend',
  },
  {
    title: 'Graph Search Engine & Software Testing Framework',
    description: 'A Java graph-processing project supporting graph parsing, traversal algorithms, graph modification, DOT export, automated testing, and continuous integration.',
    technologies: ['Java', 'Maven', 'JUnit', 'GitHub Actions', 'BFS', 'DFS', 'Design Patterns'],
    displayUrl: 'www.moongle.com/manushri/projects/graph-search-engine',
  },
  {
    title: 'ASP.NET Service-Oriented Personal Dashboard',
    description: 'A database-backed dashboard containing authentication, role-based access, session management, event management, external API integration, and modular backend services.',
    technologies: ['C#', 'ASP.NET Core', 'SQL Server', 'Authentication', 'REST APIs'],
    displayUrl: 'www.moongle.com/manushri/projects/personal-dashboard',
  },
  {
    title: 'Project Management Database System',
    description: 'A relational database system designed around employees, projects, managers, billing, timesheets, reports, and bug-tracking workflows.',
    technologies: ['MySQL', 'SQL', 'ER Modeling', 'Normalization', 'Relational Database Design'],
    displayUrl: 'www.moongle.com/manushri/projects/project-management-database',
  },
  {
    title: 'AI-Assisted Debugging & Testing Project',
    description: 'A Python project focused on identifying reproducible bugs, refactoring application logic, separating responsibilities, writing tests, and critically reviewing AI-generated code.',
    technologies: ['Python', 'Streamlit', 'pytest', 'Git'],
    displayUrl: 'www.moongle.com/manushri/projects/ai-debugging-testing',
  },
  {
    title: 'Website Redesign & User Research Case Study',
    description: 'A usability-focused redesign project involving participant research, task testing, Figma prototyping, survey analysis, and qualitative and quantitative evaluation.',
    technologies: ['Figma', 'Usability Testing', 'User Research', 'Data Analysis'],
    displayUrl: 'www.moongle.com/manushri/projects/website-redesign',
  },
  {
    title: 'SceneStack — Production Coordination for Student Filmmakers',
    description: 'An in-progress platform concept for student filmmakers and small production crews to manage projects, roles, call sheets, documents, acknowledgements, and production updates.',
    technologies: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'Authentication', 'Role-Based Access Control'],
    displayUrl: 'www.moongle.com/manushri/projects/scenestack',
    inDevelopment: true,
  },
];

export const ProjectsPage = () => {
  const logoPath = `${import.meta.env.BASE_URL}assets/icons/moogle.png`;
  const [searchQuery, setSearchQuery] = useState('Manushri Muruga Kumar\'s projects');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSearching) {
      timeoutId = setTimeout(() => {
        setIsSearching(false);
      }, 600);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSearching]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <div className="moongle-page">
      {/* Header */}
      <div className="moongle-header">
        <div className="moongle-header-top">
          <img src={logoPath} alt="Moongle" className="moongle-logo" />
          <div className="moongle-header-right">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="moongle-search-input"
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(e as any);
              }}
            />
            <button onClick={handleSearch} className="moongle-search-button">
              Search
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="moongle-navigation">
          <div className="moongle-navigation-left">
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link moongle-nav-active">
              Web
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              Images
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              Groups
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              News
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              Froogle
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              Local
              <span className="moongle-nav-label-new">New!</span>
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              more »
            </a>
          </div>
          <div className="moongle-nav-right">
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              Advanced Search
            </a>
            <a href="#" onClick={handleLinkClick} className="moongle-nav-link">
              Preferences
            </a>
          </div>
        </div>
      </div>

      {/* Results Info Bar */}
      <div className="moongle-results-bar">
        <span className="moongle-results-bar-left">Web</span>
        <span className="moongle-results-bar-right">
          Results 1 - 9 of about 47,200 for Manushri Muruga Kumar's projects. (0.04 seconds)
        </span>
      </div>

      {/* Main Content */}
      {isSearching ? (
        <div className="moongle-loading">
          <p>Searching Moongle...</p>
        </div>
      ) : (
        <div className="moongle-layout">
          {/* Results Column */}
          <div className="moongle-results">
            {PROJECTS.map((project, idx) => (
              <div key={idx} className="moongle-result">
                <a
                  href="#"
                  onClick={handleLinkClick}
                  className="moongle-result-title"
                >
                  {project.title}
                </a>
                {project.inDevelopment && (
                  <div className="moongle-result-label">Currently in development</div>
                )}
                <div className="moongle-result-description">
                  {project.description}
                  {project.clientOwned && (
                    <div className="moongle-client-note">
                      Client-owned code; project details shown at a high level.
                    </div>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="moongle-result-technologies">
                    <strong>Technologies:</strong> {project.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="moongle-sidebar">
            <div className="moongle-sponsored-links">
              <h3 className="moongle-sidebar-heading">Sponsored Links</h3>
              <div className="moongle-sponsored-link">
                <a href="#" onClick={handleLinkClick} className="moongle-sponsored-title">
                  Hire Manushri
                </a>
                <div className="moongle-sponsored-description">
                  New-grad software engineer available for full-stack, backend, and product engineering opportunities.
                </div>
                <div className="moongle-sponsored-url">
                  www.manushri.dev/hire
                </div>
              </div>

              <div className="moongle-sponsored-link">
                <a href="#" onClick={handleLinkClick} className="moongle-sponsored-title">
                  SceneStack — Coming Soon
                </a>
                <div className="moongle-sponsored-description">
                  Production coordination software for student filmmakers and indie crews.
                </div>
                <div className="moongle-sponsored-url">
                  www.manushri.dev/scenestack
                </div>
              </div>

              <div className="moongle-sponsored-link">
                <a href="#" onClick={handleLinkClick} className="moongle-sponsored-title">
                  View GitHub
                </a>
                <div className="moongle-sponsored-description">
                  Repositories, coding projects, experiments, and technical work.
                </div>
                <div className="moongle-sponsored-url">
                  github.com/manushri1415
                </div>
              </div>

              <div className="moongle-sponsored-link">
                <a href="#" onClick={handleLinkClick} className="moongle-sponsored-title">
                  Download Résumé
                </a>
                <div className="moongle-sponsored-description">
                  Experience, technical skills, education, and selected projects.
                </div>
                <div className="moongle-sponsored-url">
                  www.manushri.dev/resume
                </div>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="moongle-popular-searches">
              <h3 className="moongle-sidebar-heading">Popular Searches</h3>
              <div className="moongle-popular-search-list">
                <a href="#" onClick={handleLinkClick}>React</a>
                <a href="#" onClick={handleLinkClick}>TypeScript</a>
                <a href="#" onClick={handleLinkClick}>Python</a>
                <a href="#" onClick={handleLinkClick}>Full-Stack</a>
                <a href="#" onClick={handleLinkClick}>Backend</a>
                <a href="#" onClick={handleLinkClick}>Artificial Intelligence</a>
                <a href="#" onClick={handleLinkClick}>Databases</a>
                <a href="#" onClick={handleLinkClick}>Testing</a>
                <a href="#" onClick={handleLinkClick}>AWS</a>
                <a href="#" onClick={handleLinkClick}>Filmmaking Technology</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
