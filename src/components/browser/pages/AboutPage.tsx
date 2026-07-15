import { useState } from 'react';
import './AboutPage.css';
import {
  DIRECTOR_VIDEOS,
  FEATURED_EXPERIENCES,
  RECENT_COMMENTS,
  VIDEO_RESPONSES,
} from './aboutPageData';
import { ImageLightbox } from './ImageLightbox';

export const AboutPage = () => {
  const logoPath = `${import.meta.env.BASE_URL}assets/icons/Heading.png`;
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = (src: string, alt: string) => {
    setLightboxImage({ src: `${import.meta.env.BASE_URL}${src}`, alt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const basePath = import.meta.env.BASE_URL;

  return (
    <div className="mtube-page">
      {/* Masthead */}
      <div className="mtube-masthead">
        <div className="mtube-masthead-left">
          <img src={logoPath} alt="MTube Logo" className="mtube-logo" />
          <div className="mtube-search-section">
            <input type="text" placeholder="" className="mtube-search-input" />
            <select className="mtube-search-dropdown">
              <option>Videos</option>
              <option>Channels</option>
              <option>Groups</option>
            </select>
            <button className="mtube-search-button">Search</button>
          </div>
        </div>
        <div className="mtube-masthead-right">
          <div className="mtube-links-section">
            <a href="#" className="mtube-link-blue">Sign Up</a>
            <span className="mtube-link-separator">|</span>
            <a href="#" className="mtube-link-blue">Log In</a>
            <span className="mtube-link-separator">|</span>
            <a href="#" className="mtube-link-blue">Viewing History</a>
            <span className="mtube-link-separator">|</span>
            <a href="#" className="mtube-link-blue">Help</a>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="mtube-nav-primary">
        {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((tab, idx) => (
          <button
            key={tab}
            className={`mtube-nav-tab ${idx === 1 ? 'mtube-nav-tab-active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>


      {/* Main Content */}
      <div className="mtube-content">
        <div className="mtube-layout">
          {/* Left Column */}
          <div className="mtube-left-column">
            {/* About This Creator */}
            <div className="mtube-section" id="about-creator">
              <h2 className="mtube-section-title">About This Creator</h2>

              <div className="mtube-intro-block">
                <p className="mtube-intro-text">
                  I'm a Computer Science graduate from Arizona State University interested in full-stack, backend, and product-focused software engineering. I build systems that help people communicate, organize information, and make better decisions.
                </p>
                <p className="mtube-intro-subtext italic">
                  Beyond code, I'm passionate about filmmaking, visual storytelling, anime, K-dramas, and the unpredictable magic of competition and creation.
                </p>
              </div>

              <div className="mtube-info-fields">
                <div className="mtube-info-field">
                  <span className="mtube-field-label">School:</span>
                  <span className="mtube-field-value">Arizona State University (B.S. Computer Science, 2026)</span>
                </div>
                <div className="mtube-info-field">
                  <span className="mtube-field-label">Home Base:</span>
                  <span className="mtube-field-value">Tempe, Arizona</span>
                </div>
                <div className="mtube-info-field">
                  <span className="mtube-field-label">Interests:</span>
                  <span className="mtube-field-value">Software Engineering, AI/ML, Product Design, Filmmaking, Visual Storytelling</span>
                </div>
                <div className="mtube-info-field">
                  <span className="mtube-field-label">Categories:</span>
                  <span className="mtube-field-value">Full-Stack Development, Backend Systems, Product Engineering, Creative Technology</span>
                </div>
                <div className="mtube-info-field">
                  <span className="mtube-field-label">Tags:</span>
                  <span className="mtube-field-value">TypeScript, React, Python, Problem-Solving, Team Collaboration, Filmmaking, Anime</span>
                </div>
              </div>

              <div className="mtube-featured-projects">
                <h3 className="mtube-featured-title">Featured Projects</h3>
                <ul className="mtube-featured-list">
                  <li><a href="#" className="mtube-featured-link">Collegiate — AI-Powered College & Career Planning Platform</a></li>
                  <li><a href="#" className="mtube-featured-link">Evexia — Healthcare Data Transparency Platform</a></li>
                  <li><a href="#" className="mtube-featured-link">Censend — AI Professional Communication Extension</a></li>
                  <li><a href="#" className="mtube-featured-link">SceneStack — Production Coordination for Filmmakers</a></li>
                </ul>
                <p className="mtube-featured-footer"><a href="#featured-projects" className="mtube-link">See full list on Moongle →</a></p>
              </div>
            </div>

            {/* Explore More Videos */}
            <div className="mtube-section" id="explore-more">
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

            {/* Recent Comments */}
            <div className="mtube-section">
              <h2 className="mtube-section-title">Recent Comments</h2>
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
                      <a href="#" className="mtube-comment-reply">Reply</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Responses */}
            <div className="mtube-section" id="video-responses">
              <h2 className="mtube-section-title">Beyond Code: My Life & Experiences</h2>

              <div id="film-production">
                <h3 className="mtube-subsection-title">Film & Production</h3>
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

              <div id="campus-life">
                <h3 className="mtube-subsection-title">Work & Campus Life</h3>
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
            </div>
          </div>

          {/* Right Column - Director Videos Sidebar */}
          <div className="mtube-sidebar">
            <div className="mtube-sidebar-section">
              <h3 className="mtube-sidebar-title">Director Videos</h3>
              <div className="mtube-director-videos">
                {DIRECTOR_VIDEOS.map((video) => (
                  <a key={video.id} href={video.anchor} className="mtube-director-link">
                    <img
                      src={`${basePath}${video.thumbnail}`}
                      alt={video.title}
                      className="mtube-director-thumb"
                    />
                    <span className="mtube-director-label">{video.title}</span>
                  </a>
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
          <a href={`${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`} target="_blank" rel="noopener noreferrer" className="mtube-link">
            Resume
          </a>
          {' | '}
          <a href="#" className="mtube-link">
            Projects
          </a>
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
