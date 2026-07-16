import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';
import { ExperiencePage } from './ExperiencePage';
import { ContactPage } from './ContactPage';

type BrowserPageSize = {
  width: number;
  height: number;
};

type BrowserPageConfig = {
  title: string;
  label: string;
  url: string;
  Component: typeof AboutPage | typeof ProjectsPage | typeof ExperiencePage | typeof ContactPage;
  preferredWindowSize: BrowserPageSize;
  minWindowSize?: BrowserPageSize;
};

export const BROWSER_PAGES: Record<string, BrowserPageConfig> = {
  about: {
    title: '',
    label: 'My story',
    url: 'www.mtube.com/about',
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
  experience: {
    title: '',
    label: 'Experience',
    url: 'http://www.themanubook.com/manushri',
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
