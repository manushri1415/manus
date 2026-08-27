import { useEffect, useState, type FormEvent } from 'react';
import './ProjectsPage.css';
import {
  DEFAULT_QUERY,
  PROJECTS,
  SEARCH_NAME_PREFIX,
  navLinks,
  popularSearches,
  popularSearchFilters,
  utilityLinks,
  type ProjectResult,
} from './projectsPageData';

interface ProjectsPageProps {
  onNavigate?: (page: 'about' | 'experience' | 'contact' | 'pawpal') => void;
}

const getProjectSearchText = (project: ProjectResult) =>
  [
    project.title,
    project.slug,
    project.highlight,
    project.description,
    project.note,
    project.technologies.join(' '),
    project.detailSections?.map((section) => `${section.label} ${section.items.join(' ')}`).join(' '),
    project.displayUrl,
    project.slug === 'pawpal-ai'
      ? 'pet health records veterinary documents llm agents claude anthropic api pydantic vector search cosine similarity feature hashing embeddings prompt guardrails human in the loop ai evidence grounding approval workflow contradiction detection reminder engine'
      : '',
    'project',
  ]
    .join(' ')
    .toLowerCase();

export const ProjectsPage = ({ onNavigate }: ProjectsPageProps) => {
  const logoPath = `${import.meta.env.BASE_URL}assets/icons/moogle.png`;
  const resumePdfPath = `${import.meta.env.BASE_URL}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);
  const [lastSearchedQuery, setLastSearchedQuery] = useState(DEFAULT_QUERY);
  const [activeNavLabel, setActiveNavLabel] = useState('Web');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPopularSearch, setSelectedPopularSearch] = useState<(typeof popularSearches)[number] | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isSearching) {
      timeoutId = setTimeout(() => {
        setIsSearching(false);
      }, 600);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSearching]);

  const triggerSearch = (
    nextQuery: string,
    navLabel = activeNavLabel,
    popularSearch: (typeof popularSearches)[number] | null = null,
  ) => {
    const normalizedQuery = nextQuery.trim() || DEFAULT_QUERY;
    setSearchQuery(normalizedQuery);
    setLastSearchedQuery(normalizedQuery);
    setActiveNavLabel(navLabel);
    setSelectedPopularSearch(popularSearch);
    setIsSearching(true);
  };

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    triggerSearch(searchQuery);
  };

  const handleProjectClick = (project: ProjectResult) => {
    if (project.slug === 'pawpal-ai') {
      onNavigate?.('pawpal');
      return;
    }

    triggerSearch(project.title, 'Web');
  };

  const filteredProjects = selectedPopularSearch
    ? PROJECTS.filter((project) => {
        const projectSearchText = getProjectSearchText(project);
        return popularSearchFilters[selectedPopularSearch].some((term) => projectSearchText.includes(term));
      })
    : PROJECTS;

  const resultsSummary =
    filteredProjects.length === 0
      ? `Results 0 - 0 of 0 for ${lastSearchedQuery}. (0.04 seconds)`
      : `Results 1 - ${filteredProjects.length} of about ${filteredProjects.length.toLocaleString()} for ${lastSearchedQuery}. (0.04 seconds)`;

  return (
    <div className="moongle-page">
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
                if (e.key === 'Enter') handleSearch(e as unknown as FormEvent);
              }}
            />
            <button onClick={() => handleSearch()} className="moongle-search-button">
              Search
            </button>
          </div>
        </div>

        <div className="moongle-navigation">
          <div className="moongle-navigation-left">
            {navLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => triggerSearch(item.query, item.label)}
                className={`moongle-nav-link${activeNavLabel === item.label ? ' moongle-nav-active' : ''}`}
              >
                {item.label === 'Local' ? (
                  <>
                    {item.label}
                    <span className="moongle-nav-label-new">New!</span>
                  </>
                ) : (
                  item.label
                )}
              </button>
            ))}
          </div>
          <div className="moongle-nav-right">
            {utilityLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => triggerSearch(item.query, item.label)}
                className={`moongle-nav-link${activeNavLabel === item.label ? ' moongle-nav-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="moongle-results-bar">
        <span className="moongle-results-bar-left">{activeNavLabel}</span>
        <span className="moongle-results-bar-right">{resultsSummary}</span>
      </div>

      {isSearching ? (
        <div className="moongle-loading">
          <p>Searching Moongle...</p>
        </div>
      ) : (
        <div className="moongle-layout">
          <div className="moongle-results">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                return (
                  <div key={project.title} className="moongle-result">
                    <button
                      type="button"
                      onClick={() => handleProjectClick(project)}
                      className="moongle-result-title"
                    >
                      {project.title}
                    </button>
                    {project.highlight && <div className="moongle-result-label">{project.highlight}</div>}
                    <div className="moongle-result-description">
                      {project.description}
                      {project.note && <div className="moongle-client-note">{project.note}</div>}
                    </div>
                    {project.technologies.length > 0 && (
                      <div className="moongle-result-technologies">
                        <strong>Technologies:</strong> {project.technologies.join(' · ')}
                      </div>
                    )}
                    {project.detailSections?.map((section) => (
                      <div key={`${project.title}-${section.label}`} className="moongle-result-technologies">
                        <strong>{section.label}:</strong> {section.items.join(' · ')}
                      </div>
                    ))}
                    <div className="moongle-result-url">{project.displayUrl}</div>
                  </div>
                );
              })
            ) : (
              <div className="moongle-no-results">
                No projects matched <strong>{selectedPopularSearch}</strong>. Try another popular search.
              </div>
            )}
          </div>

          <div className="moongle-sidebar">
            <div className="moongle-popular-searches">
              <h3 className="moongle-sidebar-heading">Popular Searches</h3>
              <div className="moongle-popular-search-list">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => triggerSearch(`${SEARCH_NAME_PREFIX} ${term}`, 'Web', term)}
                    className={`moongle-popular-search-button${
                      selectedPopularSearch === term ? ' moongle-popular-search-button-active' : ''
                    }`}
                    aria-pressed={selectedPopularSearch === term}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="moongle-sponsored-links">
              <h3 className="moongle-sidebar-heading">Sponsored Links</h3>

              <div className="moongle-sponsored-link">
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="moongle-sponsored-title"
                >
                  Hire Manushri
                </button>
                <div className="moongle-sponsored-description">
                  New-grad software engineer available for full-stack, backend, and product engineering opportunities.
                </div>
                <div className="moongle-sponsored-url">www.manushri.dev/hire</div>
              </div>

              <div className="moongle-sponsored-link">
                <button
                  type="button"
                  onClick={() => triggerSearch('ApplyAide job application assistant', 'Web')}
                  className="moongle-sponsored-title"
                >
                  ApplyAide
                </button>
                <div className="moongle-sponsored-description">
                  Browser extension and web dashboard for job analysis, autofill, and application tracking.
                </div>
                <div className="moongle-sponsored-url">applyaide.manushri.dev</div>
              </div>

              <div className="moongle-sponsored-link">
                <a
                  href="https://github.com/manushri1415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="moongle-sponsored-title"
                >
                  View GitHub
                </a>
                <div className="moongle-sponsored-description">
                  Repositories, coding projects, experiments, and technical work.
                </div>
                <div className="moongle-sponsored-url">github.com/manushri1415</div>
              </div>

              <div className="moongle-sponsored-link">
                <a
                  href={resumePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="moongle-sponsored-title"
                >
                  Download Resume
                </a>
                <div className="moongle-sponsored-description">
                  Experience, technical skills, education, and selected projects.
                </div>
                <div className="moongle-sponsored-url">www.manushri.dev/resume</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
