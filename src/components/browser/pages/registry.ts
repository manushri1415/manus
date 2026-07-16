import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';
import { ExperiencePage } from './ExperiencePage';
import { ContactPage } from './ContactPage';

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
  contact: {
    title: '',
    label: 'Contact',
    url: 'http://www.manupress.com/contact',
    Component: ContactPage,
  },
};

export type BrowserPageKey = keyof typeof BROWSER_PAGES;
