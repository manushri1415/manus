import './ExperiencePage.css';
import { EXPERIENCE_CATEGORIES } from './experienceData';

interface ExperiencePageProps {
  onClose?: () => void;
  onNavigate?: (page: 'about' | 'projects') => void;
}

export const ExperiencePage = ({ onClose, onNavigate }: ExperiencePageProps) => {
  const basePath = import.meta.env.BASE_URL;

  const resumePdfPath = `${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;
  const logoPath = `${basePath}assets/icons/M-photos/themanubook-logo.png`;
  const profilePicPath = `${basePath}assets/icons/M-photos/Manu-profile-pic.jpeg`;
  const headerArtPath = `${basePath}assets/icons/M-photos/facebook-left.png`;
  const linkedInUrl = 'https://linkedin.com/in/manushrimurugakumar';

  return (
    <div className="experience-profile-page">
      {/* Main Header */}
      <div className="themanubook-header-shell">
        <div className="themanubook-header">
          <div className="themanubook-hero-art">
            <img src={headerArtPath} alt="" className="themanubook-hero-image" aria-hidden="true" />
          </div>

          <div className="themanubook-brand-panel">
            <img src={logoPath} alt="themanubook" className="themanubook-logo" />
            <div className="themanubook-nav">
              <button className="themanubook-nav-link" onClick={onClose}>
                home
              </button>
              <button className="themanubook-nav-link" onClick={() => onNavigate?.('about')}>
                profile
              </button>
              <span className="themanubook-nav-current">experience</span>
              <button className="themanubook-nav-link" onClick={() => onNavigate?.('projects')}>
                projects
              </button>
              <a href="mailto:manushrimkumar@gmail.com" className="themanubook-nav-link">
                contact
              </a>
              <a href={resumePdfPath} target="_blank" rel="noopener noreferrer" className="themanubook-nav-link">
                resume
              </a>
              <button className="themanubook-nav-link" onClick={onClose}>
                logout
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Header */}
        <div className="themanubook-subheader">
          <div className="themanubook-subheader-left">Manushri Muruga Kumar&apos;s Profile</div>
          <div className="themanubook-subheader-right">Arizona State University</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="themanubook-content">
        <div className="themanubook-section-left">
          <div className="themanubook-box">
            <div className="themanubook-box-title">Picture</div>
            <div className="themanubook-picture-box">
              <img src={profilePicPath} alt="Manushri Muruga Kumar" className="themanubook-picture" />
            </div>
          </div>

          {/* Action Links */}
          <div className="themanubook-action-link">
            <a href="mailto:manushrimkumar@gmail.com" className="themanubook-action-text">
              Send Manushri a Message
            </a>
          </div>

          <div className="themanubook-action-link">
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="themanubook-action-text">
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="themanubook-section-middle">
          <div className="themanubook-info-panel">
            <div className="themanubook-info-title">Information</div>

            <div className="themanubook-info-section">
              <h3 className="themanubook-info-section-label">Account Info:</h3>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Name:</span>
                <span className="themanubook-info-value">Manushri Muruga Kumar</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Current Title:</span>
                <span className="themanubook-info-value">Software Engineer /Computer Science Graduate</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Member Since:</span>
                <span className="themanubook-info-value">Feb 15 2005</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Last Update:</span>
                <span className="themanubook-info-value">Recently</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Hometown:</span>
                <span className="themanubook-info-value">Chennai, India</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Current Location:</span>
                <span className="themanubook-info-value">Tempe, Arizona</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Looking For:</span>
                <span className="themanubook-info-value">New-grad software engineering opportunities</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Interests:</span>
                <span className="themanubook-info-value">
                  Full-stack engineering, backend development, product engineering, applied AI, testing, cloud (AWS)
                </span>
              </div>
            </div>

            <div className="themanubook-info-section">
              <h3 className="themanubook-info-section-label">Education:</h3>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">University:</span>
                <span className="themanubook-info-value">Arizona State University</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Degree:</span>
                <span className="themanubook-info-value">B.S. Computer Science (Aug 2022 - Jul 2026)</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Location:</span>
                <span className="themanubook-info-value">Tempe, Arizona</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Certifications:</span>
                <span className="themanubook-info-value">
                  AI Fluency: Framework & Foundations (Anthropic, July 2026)
                  <br />
                  AWS Cloud Practitioner Essentials (AWS, July 2026)
                </span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">School:</span>
                <span className="themanubook-info-value">Sunshine Chennai Senior Secondary School (2010-2022)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="themanubook-section-right">
          {EXPERIENCE_CATEGORIES.map((category) => (
            <div key={category.id}>
              <div className="themanubook-category-label">{category.label}</div>

              <div className="themanubook-experience-entries">
                {category.entries.map((entry) => (
                  <div key={entry.id} className="themanubook-entry">
                    <div className="themanubook-entry-title">{entry.title}</div>
                    <div className="themanubook-entry-org">
                      {entry.organization}
                      {entry.dates && <span className="themanubook-entry-dates"> - {entry.dates}</span>}
                    </div>
                    {entry.location && <div className="themanubook-entry-location">{entry.location}</div>}
                    {entry.highlights.length > 0 && (
                      <ul className="themanubook-entry-highlights">
                        {entry.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                    {entry.skills && (
                      <div className="themanubook-entry-skills">
                        <strong>Technologies:</strong> {entry.skills}
                      </div>
                    )}
                    {entry.relatedProject && (
                      <div className="themanubook-entry-related">
                        <button onClick={() => onNavigate?.('projects')} className="themanubook-related-link">
                          {entry.relatedProject}
                        </button>
                      </div>
                    )}
                    <div className="themanubook-entry-divider" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="themanubook-ad-container">
            <a
              href={resumePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="themanubook-ad-link"
              aria-label="Open Manushri Muruga Kumar's resume"
            >
              <img
                src={`${basePath}assets/icons/M-photos/ads.png`}
                alt="Congratulations! You discovered a new-grad software engineer. Click here to hire."
                className="themanubook-ad-image"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
