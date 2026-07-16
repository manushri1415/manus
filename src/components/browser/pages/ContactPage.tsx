import { useState, useRef } from 'react';
import './ContactPage.css';

interface ContactPageProps {
  onClose?: () => void;
  onNavigate?: (page: 'about' | 'projects' | 'experience') => void;
}

export const ContactPage = ({ onClose, onNavigate }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    sendCopy: false,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const basePath = import.meta.env.BASE_URL;
  const logoPath = `${basePath}assets/icons/manupress-logo.png`;
  const resumePdfPath = `${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCTAClick = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    nameInputRef.current?.focus();
    nameInputRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO(api): replace this block with the real submission once the backend is ready, e.g.
    // const res = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, subject, message, sendCopy }),
    // });
    // if (res.ok) { setStatusMessage('Your message has been sent!'); }

    setStatusMessage(
      'This form is still being connected. Please email Manushri directly for now.'
    );
  };

  return (
    <div className="manupress-page">
      <header className="manupress-masthead">
        <img
          src={logoPath}
          alt="ManuPress.com"
          className="manupress-logo"
        />
      </header>

      <div className="manupress-panel">
        <div className="manupress-columns">
          {/* Left Column */}
          <div className="manupress-col-left">
            <p className="manupress-intro">
              ManuPress.com is the easiest way to reach Manushri Muruga Kumar —
              a software engineer, filmmaker, and visual storyteller building
              thoughtful digital experiences.
            </p>

            <h2 className="manupress-section-title">Why Manushri?</h2>
            <ul className="manupress-bullet-list">
              <li>Builds full-stack, backend, and AI-integrated applications.</li>
              <li>
                Thinks like both an engineer and a visual storyteller.
              </li>
              <li>
                Cares about creating useful, human-centered products.
              </li>
              <li>
                Always open to meaningful technical and creative conversations.
              </li>
            </ul>

            <h2 className="manupress-section-title">Find Me Around the Web</h2>
            <ol className="manupress-link-list">
              <li>
                <a
                  href="mailto:manushrimkumar@gmail.com"
                  className="manupress-link"
                >
                  Send me an email
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/manushrimurugakumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/manushri1415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="tel:+16234194046" className="manupress-link">
                  Call or text me
                </a>
              </li>
              <li>
                <a
                  href={resumePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  Download my résumé
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@ManushriMurugaKumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.imdb.com/name/nm15995579/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  IMDb
                </a>
              </li>
              <li>
                <a
                  href="https://letterboxd.com/actor/manushri-muruga-kumar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  Letterboxd
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('projects')}
                  className="manupress-link-button"
                >
                  View my projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('about')}
                  className="manupress-link-button"
                >
                  Learn more about me
                </button>
              </li>
            </ol>
          </div>

          {/* Vertical Divider */}
          <div className="manupress-divider" />

          {/* Right Column */}
          <div className="manupress-col-right">
            <p className="manupress-cta-intro">
              Have a project, opportunity, or strange internet idea?
            </p>
            <button
              onClick={handleCTAClick}
              className="manupress-cta-button"
            >
              Contact Manushri now »
            </button>

            <h2 className="manupress-section-title">Send Me a Message</h2>
            <p className="manupress-wip-note">
              Message delivery is still being connected. For now, please use
              email or LinkedIn for anything time-sensitive.
            </p>

            <form onSubmit={handleSubmit} className="manupress-form">
              <div className="manupress-form-group">
                <label htmlFor="name" className="manupress-form-label">
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="manupress-form-input"
                />
              </div>

              <div className="manupress-form-group">
                <label htmlFor="email" className="manupress-form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="manupress-form-input"
                />
              </div>

              <div className="manupress-form-group">
                <label htmlFor="subject" className="manupress-form-label">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="manupress-form-input"
                />
              </div>

              <div className="manupress-form-group">
                <label htmlFor="message" className="manupress-form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="manupress-form-textarea"
                />
              </div>

              <div className="manupress-checkbox-group">
                <input
                  type="checkbox"
                  id="sendCopy"
                  name="sendCopy"
                  checked={formData.sendCopy}
                  onChange={handleInputChange}
                  className="manupress-form-checkbox"
                />
                <label htmlFor="sendCopy" className="manupress-checkbox-label">
                  Send me a copy
                </label>
              </div>

              <button
                type="submit"
                className="manupress-form-submit"
              >
                Send »
              </button>
            </form>

            {statusMessage && (
              <p
                role="status"
                aria-live="polite"
                className="manupress-form-status"
              >
                {statusMessage}
              </p>
            )}

            <div className="manupress-divider-thin" />

            <h3 className="manupress-subsection-title">Did You Know?</h3>
            <ul className="manupress-trivia-list">
              <li>
                <a
                  href="https://www.youtube.com/watch?v=5-MCFJZabrE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manupress-link"
                >
                  Made a childhood-memories film spanning 2005–2022
                </a>
              </li>
              <li>
                <button
                  onClick={onClose}
                  className="manupress-link-button"
                >
                  Built this portfolio like an early-2000s desktop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('about')}
                  className="manupress-link-button"
                >
                  Creates films and software
                </button>
              </li>
              <li>
                Loves anime, K-dramas, music, and visual storytelling
              </li>
              <li>Nala and Jalapeño supervise production</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <footer className="manupress-footer">
          <p className="manupress-footer-cta">
            Want to build software, make a film, or simply say hello?{' '}
            <a
              href="mailto:manushrimkumar@gmail.com"
              className="manupress-link"
            >
              Send Manushri a message
            </a>
            .
          </p>
          <p className="manupress-credit">
            Designed, coded, and maintained somewhere on the internet.
          </p>
          <p className="manupress-badge">A MANUSHRI MURUGA KUMAR PRODUCTION</p>
        </footer>
      </div>
    </div>
  );
};
