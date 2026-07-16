import { useState, useRef } from 'react';
import './ExperiencePage.css';
import { EXPERIENCE_CATEGORIES, EXPERIENCE_PHOTOS } from './experienceData';

interface ExperiencePageProps {
  onClose?: () => void;
  onNavigate?: (page: 'about' | 'projects') => void;
}

export const ExperiencePage = ({ onClose, onNavigate }: ExperiencePageProps) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const photoGridRef = useRef<HTMLDivElement>(null);
  const basePath = import.meta.env.BASE_URL;

  const currentCategory = EXPERIENCE_CATEGORIES[currentCategoryIndex];

  const handleNext = () => {
    setCurrentCategoryIndex((prev) => (prev + 1) % EXPERIENCE_CATEGORIES.length);
  };

  const handlePrev = () => {
    setCurrentCategoryIndex((prev) => (prev - 1 + EXPERIENCE_CATEGORIES.length) % EXPERIENCE_CATEGORIES.length);
  };

  const resumePdfPath = `${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;
  const logoPath = `${basePath}assets/icons/M-photos/themanubook-logo.png`;
  const profilePicPath = `${basePath}assets/icons/M-photos/Manu-profile-pic.jpeg`;
  const linkedInUrl = 'https://linkedin.com/in/manushrimurugakumar';

  return (
    <div className="experience-profile-page">
      {/* Main Header */}
      <div className="themanubook-header">
        <img src={logoPath} alt="themanubook" className="themanubook-logo" />
        <div className="themanubook-nav">
          <button className="themanubook-nav-link" onClick={onClose}>
            home
          </button>
          <span className="themanubook-nav-sep">·</span>
          <button className="themanubook-nav-link" onClick={() => onNavigate?.('about')}>
            profile
          </button>
          <span className="themanubook-nav-sep">·</span>
          <span className="themanubook-nav-current">experience</span>
          <span className="themanubook-nav-sep">·</span>
          <button className="themanubook-nav-link" onClick={() => onNavigate?.('projects')}>
            projects
          </button>
          <span className="themanubook-nav-sep">·</span>
          <a href="mailto:manushrimkumar@gmail.com" className="themanubook-nav-link">
            contact
          </a>
          <span className="themanubook-nav-sep">·</span>
          <a href={resumePdfPath} target="_blank" rel="noopener noreferrer" className="themanubook-nav-link">
            resume
          </a>
          <span className="themanubook-nav-sep">·</span>
          <button className="themanubook-nav-link" onClick={onClose}>
            logout
          </button>
        </div>
      </div>

      {/* Sub-Header */}
      <div className="themanubook-subheader">
        <div className="themanubook-subheader-left">Manushri Muruga Kumar's Profile</div>
        <div className="themanubook-subheader-right">Arizona State University</div>
      </div>

      {/* Main Content - Single Column */}
      <div className="themanubook-content">
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
              aria-label="Open Manushri Muruga Kumar's résumé"
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
            <div className="themanubook-box-title">Experience Photos</div>
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
                <span className="themanubook-info-value">Software Engineer / Computer Science Graduate</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Member Since:</span>
                <span className="themanubook-info-value">2005</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Last Update:</span>
                <span className="themanubook-info-value">Recently</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">School:</span>
                <span className="themanubook-info-value">Arizona State University</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Degree:</span>
                <span className="themanubook-info-value">B.S. Computer Science</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Status:</span>
                <span className="themanubook-info-value">New graduate</span>
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
                <span className="themanubook-info-label">Professional Interests:</span>
                <span className="themanubook-info-value">
                  Full-stack engineering, backend development, product engineering, applied AI, databases, testing, cloud, creative technology
                </span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Profile Status:</span>
                <span className="themanubook-info-value">Building software, telling stories, and looking for the right team</span>
              </div>
            </div>

            <div className="themanubook-info-section">
              <h3 className="themanubook-info-section-label">Education:</h3>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">School:</span>
                <span className="themanubook-info-value">Arizona State University</span>
              </div>
              <div className="themanubook-info-row">
                <span className="themanubook-info-label">Degree:</span>
                <span className="themanubook-info-value">B.S. Computer Science (Aug 2022 – Jul 2026)</span>
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
              <div className="themanubook-info-row themanubook-previous-school">
                <span className="themanubook-info-label">Previously:</span>
                <span className="themanubook-info-value">Sunshine Chennai Senior Secondary School</span>
              </div>
            </div>
          </div>

          {/* Experience Navigator */}
          <div className="themanubook-experience-nav">
            <button
              className="themanubook-nav-button"
              onClick={handlePrev}
              aria-label="Previous experience category"
            >
              ‹ Previous
            </button>
            <div className="themanubook-nav-indicator">
              {currentCategoryIndex + 1} of {EXPERIENCE_CATEGORIES.length}
            </div>
            <button
              className="themanubook-nav-button"
              onClick={handleNext}
              aria-label="Next experience category"
            >
              Next ›
            </button>
          </div>

          <div className="themanubook-category-label">{currentCategory.label}</div>

          {/* Experience Entries */}
          <div className="themanubook-experience-entries">
            {currentCategory.entries.map((entry) => (
              <div key={entry.id} className="themanubook-entry">
                <div className="themanubook-entry-title">{entry.title}</div>
                <div className="themanubook-entry-org">
                  {entry.organization}
                  {entry.dates && <span className="themanubook-entry-dates"> — {entry.dates}</span>}
                </div>
                {entry.location && (
                  <div className="themanubook-entry-location">{entry.location}</div>
                )}
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
      </div>
    </div>
  );
};
