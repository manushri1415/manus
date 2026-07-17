import { FormEvent, useRef, useState } from 'react';
import './ExperiencePage.css';
import { EXPERIENCE_CATEGORIES, EXPERIENCE_PHOTOS } from './experienceData';

interface ExperiencePageProps {
  onClose?: () => void;
  onNavigate?: (page: 'about' | 'projects') => void;
}

export const ExperiencePage = ({ onClose, onNavigate }: ExperiencePageProps) => {
  const photoGridRef = useRef<HTMLDivElement>(null);
  const basePath = import.meta.env.BASE_URL;
  const [quickSearchValue, setQuickSearchValue] = useState('');

  const resumePdfPath = `${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;
  const logoPath = `${basePath}assets/icons/M-photos/themanubook-logo.png`;
  const profilePicPath = `${basePath}assets/icons/M-photos/Manu-profile-pic.jpeg`;
  const headerArtPath = `${basePath}assets/icons/M-photos/facebook-left.png`;
  const linkedInUrl = 'https://linkedin.com/in/manushrimurugakumar';

  const handleQuickSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photoGridRef.current) {
      return;
    }

    photoGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      {/* Main Content - Single Column */}
      <div className="themanubook-content">
        <aside className="themanubook-quick-rail">
          <div className="themanubook-quick-box">
            <form className="themanubook-quick-search" onSubmit={handleQuickSearchSubmit}>
              <input
                type="text"
                className="themanubook-quick-input"
                value={quickSearchValue}
                onChange={(event) => setQuickSearchValue(event.target.value)}
                placeholder="experience"
                aria-label="Quick search"
              />
              <div className="themanubook-quick-search-row">
                <div className="themanubook-quick-box-title">quick search</div>
                <button type="submit" className="themanubook-quick-button">
                  go
                </button>
              </div>
            </form>
          </div>

          <div className="themanubook-quick-links">
            <button type="button" className="themanubook-quick-link" onClick={() => onNavigate?.('about')}>
              My Profile
            </button>
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="themanubook-quick-link">
              My Network
            </a>
            <button type="button" className="themanubook-quick-link" onClick={() => onNavigate?.('projects')}>
              My Projects
            </button>
            <a href="mailto:manushrimkumar@gmail.com" className="themanubook-quick-link">
              My Messages
            </a>
            <a href={resumePdfPath} target="_blank" rel="noopener noreferrer" className="themanubook-quick-link">
              My Resume
            </a>
            <button type="button" className="themanubook-quick-link" onClick={onClose}>
              My Logout
            </button>
          </div>
        </aside>

        {/* Picture & Actions Section */}
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

          {/* Classified Ad */}
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

          {/* Experience Photos */}
          <div className="themanubook-box" ref={photoGridRef}>
            <div className="themanubook-box-title">Gallery</div>
            <div className="themanubook-photo-grid">
              {EXPERIENCE_PHOTOS.map((photo) => (
                <div key={photo.id} className="themanubook-photo-item">
                  <img
                    src={`${basePath}${photo.thumbnail}`}
                    alt={photo.alt}
                    className="themanubook-photo-thumbnail"
                  />
                  <div className="themanubook-photo-caption">{photo.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Information Panel Section */}
        <div className="themanubook-section-right">
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

          {/* All Experience Categories */}
          {EXPERIENCE_CATEGORIES.map((category) => (
            <div key={category.id}>
              <div className="themanubook-category-label">{category.label}</div>

              {/* Experience Entries */}
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
        </div>
      </div>
    </div>
  );
};
