import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';

export const BROWSER_PAGES = {
  about: {
    title: '',
    url: 'www.mtube.com/about',
    Component: AboutPage,
  },
  projects: {
    title: '',
    url: 'http://www.moongle.com/search?q=manushri+muruga+kumar+projects',
    Component: ProjectsPage,
  },
};

export type BrowserPageKey = keyof typeof BROWSER_PAGES;
