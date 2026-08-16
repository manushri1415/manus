import './PawPalArticlePage.css';

interface PawPalArticlePageProps {
  onNavigate?: (page: 'projects' | 'experience' | 'contact') => void;
}

const featureRows = [
  'Pet records can be scattered across emails, documents, reminders, and appointment notes.',
  'Reminders are only useful when the health information behind them is trustworthy.',
  'AI can help read messy documents, but it should not get the final say.',
  'Every extracted field needs evidence before it can become a record.',
  'Owners approve records before PawPal can create reminders from them.',
];

const productCards = [
  {
    title: 'PawPal+',
    price: 'First version',
    body:
      'A pet-care scheduler for feeding, walking, grooming, medication, recurring tasks, priorities, and daily care plans.',
    links: ['Project origin'],
  },
  {
    title: 'PawPal AI',
    price: 'AI extension',
    body:
      'An evidence-gated document reader that proposes health records from veterinary files before sending them to human review.',
    links: ['How it works'],
  },
  {
    title: 'Reliability Layer',
    price: '118 tests',
    body:
      'Deterministic validation, contradiction checks, prompt-injection handling, approval rules, and 17/17 reliability eval cases.',
    links: ['Reliability notes'],
  },
];

const commonQuestions = [
  { label: 'Why did PawPal start?', href: '#why' },
  { label: 'What did PawPal+ do first?', href: '#pawpal-plus' },
  { label: 'How does PawPal AI work?', href: '#pipeline' },
  { label: 'Why does human review matter?', href: '#review' },
  { label: 'What reliability checks were added?', href: '#reliability' },
];

export const PawPalArticlePage = ({ onNavigate }: PawPalArticlePageProps) => {
  const logoPath = `${import.meta.env.BASE_URL}assets/icons/moongle-projects.png`;
  const adPath = `${import.meta.env.BASE_URL}assets/icons/M-photos/ads.png`;
  const resumePdfPath = `${import.meta.env.BASE_URL}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;

  return (
    <div className="pawpal-article-page">
      <header className="pawpal-earth-header">
        <div className="pawpal-earth-brand">
          <img src={logoPath} alt="Moongle" className="pawpal-earth-logo" />
        </div>
        <div className="pawpal-earth-tagline">
          <span>Pet records shouldn't disappear inside your inbox.</span>
          <span>powered by Manushri</span>
        </div>
      </header>

      <div className="pawpal-earth-layout">
        <aside className="pawpal-earth-leftnav" aria-label="PawPal article navigation">
          <button type="button" onClick={() => onNavigate?.('projects')}>Moongle Projects Home</button>
          <a href="#why">Why I built it</a>
          <a href="#pawpal-plus">PawPal+</a>
          <a href="#pipeline">Pipeline</a>
          <a href="#review">Human review</a>
          <a href="#reliability">Reliability</a>
          <a href="#learned">What I learned</a>
          <button type="button" onClick={() => onNavigate?.('experience')}>Experience</button>
          <button type="button" onClick={() => onNavigate?.('contact')}>Contact</button>
        </aside>

        <main className="pawpal-earth-main">
          <section className="pawpal-earth-intro" id="why">
            <h1>PawPal AI</h1>
            <h2>I missed one of my cats' vaccinations.</h2>
            <p>
              I have two cats, and at one point I realized I had missed a vaccination date.
              There was not really one place I could check. The information was buried somewhere
              between emails, vet documents, old reminders, and appointment records.
            </p>
            <p>
              That bothered me because pet care should not depend on remembering which email
              contained a date from months ago. Our pets are family. Something as simple as keeping
              track of a vaccination or medication schedule can matter a lot for their health.
              That idea became <strong>PawPal</strong>.
            </p>

            <ul className="pawpal-earth-feature-list">
              {featureRows.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="pawpal-earth-section" id="pawpal-plus">
            <h2>The first version: PawPal+</h2>
            <p>
              I originally built PawPal+ as a pet-care scheduler. Owners could create pets, add
              feeding, medication, walking, grooming, and other care tasks, assign priorities and
              preferred times, and generate a daily schedule around their available time.
            </p>
            <p>
              I also built recurring-task logic so completing a daily, weekly, or monthly task
              automatically created its next occurrence. That worked well for tasks I already knew
              about, but there was still a bigger problem: what if the important information was
              sitting inside a veterinary document that I had forgotten about?
            </p>
          </section>

          <section className="pawpal-earth-section" id="pipeline">
            <h2>
              From PawPal+ to PawPal AI <span>[ <a href="#comparison">implementation comparison chart</a> ]</span>
            </h2>

            <div className="pawpal-earth-product-feature">
              <div className="pawpal-earth-card-heading">
                <strong>PawPal AI</strong>
                <span>Evidence first</span>
              </div>
              <p>
                The next version focused on the source of the information itself. Instead of
                manually entering every vaccine date, medication instruction, or appointment,
                PawPal AI can read veterinary documents and propose structured health records from
                them.
              </p>
              <p>
                A user can upload a PDF, DOCX, TXT file, or paste veterinary notes. The system
                follows this flow:
              </p>
              <div className="pawpal-earth-architecture">
                document - validation - chunking - retrieval - AI extraction - evidence validation - human review - reminders
              </div>
              <ul>
                <li><a href="#review">Learn why the AI does not get the final say</a></li>
                <li><a href="#reliability">Read the reliability and testing notes</a></li>
              </ul>
            </div>

            <div className="pawpal-earth-card-grid" id="comparison">
              {productCards.map((card) => (
                <article key={card.title} className="pawpal-earth-product-card">
                  <div className="pawpal-earth-card-heading">
                    <strong>{card.title}</strong>
                    <span>{card.price}</span>
                  </div>
                  <p>{card.body}</p>
                  {card.links.map((link) => (
                    <a key={link} href={link === 'Project origin' ? '#pawpal-plus' : link === 'How it works' ? '#pipeline' : '#reliability'}>{link}</a>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section className="pawpal-earth-section" id="review">
            <h2>AI can interpret. It should not get the final say.</h2>
            <p>
              PawPal AI uses retrieval-augmented generation to find the parts of a veterinary
              document that are relevant to vaccinations, medications, appointments, and due dates.
              The AI can then propose a structured record, but every extracted value has to point
              back to evidence in the original document.
            </p>
            <p>
              If a due date is not actually written there, PawPal does not invent one. If two
              records disagree, PawPal flags the contradiction instead of silently choosing one.
              Before anything becomes part of the pet's health record or creates a reminder, the
              owner has to review and approve it.
            </p>
          </section>

          <section className="pawpal-earth-section" id="engineering">
            <h2>Where deterministic Python comes in</h2>
            <p>
              The LLM handles interpretation. Python handles the things I do not want an LLM
              guessing about:
            </p>
            <div className="pawpal-earth-architecture">
              dates - validation - recurrence - reminders - contradictions - approval rules - persistence
            </div>
            <p>
              That separation became one of the most important design decisions in PawPal AI. The
              model proposes. The source document provides the evidence. Python verifies the rules.
              The human makes the final decision.
            </p>
          </section>

          <section className="pawpal-earth-section" id="reliability">
            <h2>Reliability mattered more than making the AI look impressive</h2>
            <p>
              A major part of this project became testing what happens when the system should not
              give an answer. PawPal is designed to abstain, reject, warn, or ask for human review
              rather than quietly fill in the gaps.
            </p>
            <ul className="pawpal-earth-feature-list">
              <li>A vaccination record has an administered date but no next-due date.</li>
              <li>Two documents contain conflicting vaccination dates.</li>
              <li>A document contains instructions trying to manipulate the AI.</li>
              <li>Someone asks PawPal for medical advice instead of information contained in their records.</li>
              <li>The AI proposes a value that cannot be found anywhere in the source document.</li>
            </ul>
            <p>
              The final system includes <strong>118 automated tests</strong> and a separate
              reliability evaluation covering <strong>17 scenarios, with 17/17 passing</strong>.
            </p>
          </section>

          <section className="pawpal-earth-section" id="learned">
            <h2>What I learned</h2>
            <p>
              PawPal started as a scheduling project. Building the AI layer changed how I thought
              about the project entirely.
            </p>
            <p>
              The most important lesson was not how to get an LLM to extract information. It was
              learning where not to trust the LLM at all. AI became useful when I treated its output
              as a proposal that could be retrieved, checked, challenged, and rejected, not as the
              final answer.
            </p>
          </section>
        </main>

        <aside className="pawpal-earth-sidebar">
          <div className="pawpal-earth-download">
            <a href="#pipeline">Hire Manushri</a>
            <span>Its that simple :)</span>
          </div>

          <div className="pawpal-earth-preview" aria-label="PawPal preview">
            <a href={resumePdfPath} target="_blank" rel="noopener noreferrer" className="pawpal-earth-ad-link">
              <img src={adPath} alt="Open Manushri Muruga Kumar resume" className="pawpal-earth-ad-image" />
            </a>
            <small>click image to open resume</small>
          </div>

          <h3>More info - common questions</h3>
          <ul className="pawpal-earth-links">
            {commonQuestions.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
            <li><button type="button" onClick={() => onNavigate?.('projects')}>More projects</button></li>
          </ul>

          <h3>But wait...there&apos;s more</h3>
          <ul className="pawpal-earth-links">
            <li><button type="button" onClick={() => onNavigate?.('experience')}>Related experience</button></li>
            <li><button type="button" onClick={() => onNavigate?.('contact')}>Ask about PawPal</button></li>
          </ul>
        </aside>
      </div>

      <footer className="pawpal-earth-footer">
        <span>(c)2005 Moongle</span>
        <button type="button" onClick={() => onNavigate?.('projects')}>Moongle Home</button>
        <button type="button" onClick={() => onNavigate?.('contact')}>About This Project</button>
      </footer>
    </div>
  );
};
