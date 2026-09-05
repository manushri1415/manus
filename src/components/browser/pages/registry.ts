import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';
import { ExperiencePage } from './ExperiencePage';
import { ContactPage } from './ContactPage';
import { PawPalArticlePage } from './PawPalArticlePage';

type BrowserPageSize = {
  width: number;
  height: number;
};

type BrowserPageConfig = {
  title: string;
  label: string;
  /** Decorative address-bar text shown inside the simulated browser chrome. Not a real route. */
  url: string;
  /** Real, shareable app route (e.g. "/projects") — distinct from the decorative `url` above. */
  route: string;
  Component: typeof AboutPage | typeof ProjectsPage | typeof ExperiencePage | typeof ContactPage | typeof PawPalArticlePage;
  preferredWindowSize: BrowserPageSize;
  minWindowSize?: BrowserPageSize;
};

export const BROWSER_PAGES: Record<string, BrowserPageConfig> = {
  about: {
    title: '',
    label: 'My story',
    url: 'www.mtube.com/about',
    route: '/about',
    Component: AboutPage,
    preferredWindowSize: {
      width: 1080,
      height: 760,
    },
    minWindowSize: {
      width: 760,
      height: 560,
    },
  },
  projects: {
    title: '',
    label: 'Projects',
    url: 'http://www.moongle.com/search?q=manushri+muruga+kumar+projects',
    route: '/projects',
    Component: ProjectsPage,
    preferredWindowSize: {
      width: 1120,
      height: 760,
    },
    minWindowSize: {
      width: 620,
      height: 520,
    },
  },
  pawpal: {
    title: 'PawPal AI - Moongle Projects',
    label: 'PawPal AI',
    url: 'http://www.moongle.com/manushri/projects/pawpal-ai',
    // Project write-ups live under /projects/<slug> — add new articles here as they're written,
    // no router changes needed (see PROJECT_ARTICLE_PATH_PREFIX below).
    route: '/projects/pawpal-ai',
    Component: PawPalArticlePage,
    preferredWindowSize: {
      width: 1080,
      height: 760,
    },
    minWindowSize: {
      width: 720,
      height: 560,
    },
  },
  experience: {
    title: '',
    label: 'Experience',
    url: 'http://www.themanubook.com/manushri',
    route: '/experience',
    Component: ExperiencePage,
    preferredWindowSize: {
      width: 1100,
      height: 760,
    },
    minWindowSize: {
      width: 700,
      height: 560,
    },
  },
  contact: {
    title: '',
    label: 'Contact',
    url: 'http://www.manupress.com/contact',
    route: '/contact',
    Component: ContactPage,
    preferredWindowSize: {
      width: 1024,
      height: 760,
    },
    minWindowSize: {
      width: 620,
      height: 560,
    },
  },
};

export type BrowserPageKey = keyof typeof BROWSER_PAGES;

/** Prefix every project write-up route lives under (e.g. "/projects/pawpal-ai"). */
export const PROJECT_ARTICLE_PATH_PREFIX = '/projects/';

const ROUTE_TO_PAGE_KEY: Record<string, BrowserPageKey> = Object.fromEntries(
  (Object.entries(BROWSER_PAGES) as [BrowserPageKey, BrowserPageConfig][]).map(([key, config]) => [
    config.route,
    key,
  ]),
);

/**
 * Resolve a real app pathname (e.g. from useLocation()) to the registry key it should open.
 * Returns null for "/" (no window should auto-open) or any unrecognized path.
 */
export const getPageKeyForPath = (pathname: string): BrowserPageKey | null => {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTE_TO_PAGE_KEY[normalized] ?? null;
};

/** The route to show in the real address bar for a given open page, if any. */
export const getRouteForPageKey = (pageKey: BrowserPageKey | null | undefined): string | null =>
  pageKey ? BROWSER_PAGES[pageKey]?.route ?? null : null;
