import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';
import { ExperiencePage } from './ExperiencePage';

export const BROWSER_PAGES = {
  about: {
    title: '',
    label: 'About Me',
    url: 'www.mtube.com/about',
    Component: AboutPage,
  },
  projects: {
    title: '',
    label: 'Projects',
    url: 'http://www.moongle.com/search?q=manushri+muruga+kumar+projects',
    Component: ProjectsPage,
  },
  experience: {
    title: '',
    label: 'Experience',
    url: 'http://www.themanubook.com/manushri',
    Component: ExperiencePage,
  },
};

export type BrowserPageKey = keyof typeof BROWSER_PAGES;
