import { useState } from 'react';
import './AboutPage.css';
import {
  FEATURED_EXPERIENCES,
  RECENT_COMMENTS,
  VIDEO_RESPONSES,
} from './aboutPageData';
import { ImageLightbox } from './ImageLightbox';

interface AboutPageProps {
  onClose?: () => void;
  onNavigate?: (page: 'projects' | 'experience' | 'contact') => void;
}

export const AboutPage = ({ onClose, onNavigate }: AboutPageProps) => {
  // Restructured layout: video on left, bio on right
  const logoPath = `${import.meta.env.BASE_URL}assets/icons/Heading.png`;
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = (src: string, alt: string) => {
    setLightboxImage({ src: `${import.meta.env.BASE_URL}${src}`, alt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const basePath = import.meta.env.BASE_URL;
  const resumePdfPath = `${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;
  const childhoodVideoUrl = 'https://www.youtube.com/watch?v=5-MCFJZabrE';
  const contactMailto = 'mailto:manushrimkumar@gmail.com?subject=Portfolio%20Hello';
  const helpMailto = 'mailto:manushrimkumar@gmail.com?subject=MTube%20Help';

  return (
    <div className="mtube-page">
      {/* Masthead */}
      <div className="mtube-masthead">
        <div className="mtube-masthead-left">
          <img src={logoPath} alt="MTube Logo" className="mtube-logo" />
          <div className="mtube-header-stack">
            <div className="mtube-search-section">
              <input type="text" placeholder="Manushri Muruga Kumar" className="mtube-search-input" />
              <button className="mtube-search-button">Search</button>
            </div>
            <div className="mtube-links-section">
              <a href={contactMailto} className="mtube-link-blue">Sign Up</a>
              <span className="mtube-link-separator">|</span>
              <button type="button" className="mtube-link-blue" onClick={() => onNavigate?.('experience')}>Log In</button>
              <span className="mtube-link-separator">|</span>
              <a href={helpMailto} className="mtube-link-blue">Help</a>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="mtube-nav-primary">
        <button className="mtube-nav-tab" onClick={onClose}>Home</button>
        <button className="mtube-nav-tab mtube-nav-tab-active">About</button>
        <button className="mtube-nav-tab" onClick={() => onNavigate?.('projects')}>Projects</button>
        <button className="mtube-nav-tab" onClick={() => onNavigate?.('experience')}>Experience</button>
        <button className="mtube-nav-tab" onClick={() => onNavigate?.('contact')}>Contact</button>
      </div>

      {/* Main Content */}
      <div className="mtube-content">
        <div className="mtube-layout">
          {/* Left Column */}
          <div className="mtube-left-column">
            {/* Top Section: Video + About */}
            <div className="mtube-section mtube-top-section">
              <div className="mtube-top-grid">
                <div className="mtube-top-video-col">
                  <div className="mtube-video-container-small">
                    <iframe
                      src="https://www.youtube.com/embed/5-MCFJZabrE?si=N6byMojIk1ex4znn"
                      title="My Childhood Memories: 2005–2022"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="mtube-iframe"
                    />
                  </div>
                    <div className= "video-title-info"> 
                      <h2 className="mtube-video-title-small">My Childhood Memories: 2005 – 2022</h2>
                      <div className="mtube-rating-section">
                        <span className="mtube-stars">★★★★★</span>
                        <span className="mtube-rating-text">Rate this video</span>
                      </div>
                    </div>
                    {/* Secondary Details */}
                    <div className="mtube-top-secondary">
                      <div className="mtube-video-stats">
                        <div className="mtube-stat-item">
                          <span className="mtube-stat-label">Views:</span>
                          <span className="mtube-stat-value">21 years of memories</span>
                        </div>
                        <div className="mtube-stat-item">
                          <span className="mtube-stat-label">Comments:</span>
                          <span className="mtube-stat-value">Character development ongoing</span>
                        </div>
                        <div className="mtube-stat-item">
                          <span className="mtube-stat-label">Favorites:</span>
                          <span className="mtube-stat-value">Too many to count</span>
                        </div>
                      </div>

                      <div className="mtube-action-buttons">
                        <a href="#building-under-pressure" className="mtube-action-link">Add to Groups</a>
                        <a href={childhoodVideoUrl} target="_blank" rel="noopener noreferrer" className="mtube-action-link">Share Video</a>
                      </div>

                      <div className="mtube-video-metadata">
                        <div className="mtube-metadata-row">
                          <span className="mtube-metadata-label">Added:</span>
                          <span className="mtube-metadata-value">6 Jun 2021</span>
                        </div>
                        <div className="mtube-metadata-row">
                          <span className="mtube-metadata-label">From:</span>
                          <span className="mtube-metadata-value">@ManushriMurugaKumar</span>
                        </div>
                        <div className="mtube-metadata-row">
                          <span className="mtube-metadata-label">Category:</span>
                          <span className="mtube-metadata-value">People & Blogs</span>
                        </div>
                        <div className="mtube-metadata-row">
                          <span className="mtube-metadata-label">Tags:</span>
                          <span className="mtube-metadata-value">childhood, memories, short film</span>
                        </div>
                      </div>
                    </div>
                </div>

                <div className="mtube-top-about-col">
                  <h3 className="mtube-about-heading">Who is Manushri Muruga Kumar?</h3>
                  <div className="mtube-about-content">
                    <p>
                      Manushri Muruga Kumar is many things, but aside from being the cosmic twin of YouTube—we share the same birthday—who is she?
                    </p>
                    <p>
                      I grew up in Chennai, India, and later moved to Arizona to study Computer Science at Arizona State University. 
                      Living between different places, cultures, and interests has shaped how I communicate, adapt, and approach unfamiliar problems.
                    </p>
                    <p>
                      I made this video a year before I moved to Arizona, back then I didn't realise I was going to embrack on this journey away from home by myself.
                    </p>
                    <p>
                      This page is less of a traditional resume and more of a collection of the places, people, projects, and memories that shaped me
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Film & Production Section */}
            <div className="mtube-section" id="film-production">
              <h2 className="mtube-section-title">Life On Set: Film & Production</h2>
              <div className="mtube-thumbnail-grid">
                {VIDEO_RESPONSES.filter((v) => v.category === 'film-production').map((item) => (
                  <div key={item.id} className="mtube-thumbnail-card">
                    <button
                      onClick={() => openLightbox(item.thumbnail, item.title)}
                      className="mtube-thumbnail-button"
                    >
                      <img src={`${basePath}${item.thumbnail}`} alt={item.title} className="mtube-thumbnail-image" />
                    </button>
                    <h4 className="mtube-card-title">{item.title}</h4>
                    {item.date && <p className="mtube-card-date">{item.date}</p>}
                    <p className="mtube-card-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hackathons & Building Under Pressure */}
            <div className="mtube-section" id="building-under-pressure">
              <h2 className="mtube-section-title">Hackathons & Competitions</h2>
              <div className="mtube-thumbnail-grid">
                {FEATURED_EXPERIENCES.map((exp) => (
                  <div key={exp.id} className="mtube-thumbnail-card">
                    <button
                      onClick={() => openLightbox(exp.thumbnail, exp.title)}
                      className="mtube-thumbnail-button"
                    >
                      <img src={`${basePath}${exp.thumbnail}`} alt={exp.title} className="mtube-thumbnail-image" />
                    </button>
                    <h4 className="mtube-card-title">{exp.title}</h4>
                    <p className="mtube-card-date">{exp.date}</p>
                    <p className="mtube-card-description">{exp.description}</p>
                    {exp.recognition && <p className="mtube-card-recognition"><strong>{exp.recognition}</strong></p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Life & Work */}
            <div className="mtube-section" id="campus-life">
              <h2 className="mtube-section-title">Working Through College: Campus & Community</h2>
              <div className="mtube-thumbnail-grid">
                {VIDEO_RESPONSES.filter((v) => v.category === 'campus-life').map((item) => (
                  <div key={item.id} className="mtube-thumbnail-card">
                    <button
                      onClick={() => openLightbox(item.thumbnail, item.title)}
                      className="mtube-thumbnail-button"
                    >
                      <img src={`${basePath}${item.thumbnail}`} alt={item.title} className="mtube-thumbnail-image" />
                    </button>
                    <h4 className="mtube-card-title">{item.title}</h4>
                    {item.date && <p className="mtube-card-date">{item.date}</p>}
                    <p className="mtube-card-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className="mtube-section" id="recent-comments">
              <h2 className="mtube-section-title">Recent Comments (6)</h2>
              <div className="mtube-comments">
                {RECENT_COMMENTS.map((comment) => (
                  <div key={comment.id} className="mtube-comment">
                    <div className="mtube-comment-header">
                      <span className="mtube-comment-user">{comment.username}</span>
                      <span className="mtube-comment-time">{comment.timeAgo}</span>
                    </div>
                    <p className="mtube-comment-text">{comment.text}</p>
                    <div className="mtube-comment-footer">
                      <span className="mtube-comment-number">#{comment.commentNumber}</span>
                      <a
                        href={`mailto:manushrimkumar@gmail.com?subject=Reply%20to%20comment%20%23${comment.commentNumber}`}
                        className="mtube-comment-reply"
                      >
                        Reply
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mtube-footer">
        <div className="mtube-footer-links">
          <a href="https://github.com/manushri1415" target="_blank" rel="noopener noreferrer" className="mtube-link">
            GitHub
          </a>
          {' | '}
          <a href="https://linkedin.com/in/manushrimurugakumar" target="_blank" rel="noopener noreferrer" className="mtube-link">
            LinkedIn
          </a>
          {' | '}
          <a href={resumePdfPath} target="_blank" rel="noopener noreferrer" className="mtube-link">
            Resume
          </a>
          {' | '}
          <button type="button" className="mtube-link" onClick={() => onNavigate?.('projects')}>
            Projects
          </button>
          {' | '}
          <a href="mailto:manushrimkumar@gmail.com" className="mtube-link">
            Contact
          </a>
        </div>
        <p className="mtube-footer-copyright">© 2026 Manushri Muruga Kumar. All rights reserved.</p>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImage && <ImageLightbox src={lightboxImage.src} alt={lightboxImage.alt} onClose={closeLightbox} />}
    </div>
  );
};
