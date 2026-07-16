import type { ComponentType } from 'react';
import { AboutPage } from './AboutPage';
import { ProjectsPage } from './ProjectsPage';
import { ExperiencePage } from './ExperiencePage';
import { ContactPage } from './ContactPage';
import { ResumePage } from './ResumePage';

type BrowserPageSize = {
  width: number;
  height: number;
};

type BrowserPageConfig = {
  title: string;
  label: string;
  url: string;
  Component: ComponentType<any>;
  contentBaseSize?: BrowserPageSize;
};

export const BROWSER_PAGES = {
  about: {
    title: '',
    label: 'About Me',
    url: 'www.mtube.com/about',
    Component: AboutPage,
    contentBaseSize: {
      width: 1080,
      height: 500,
    },
  },
  projects: {
    title: '',
    label: 'Projects',
    url: 'http://www.moongle.com/search?q=manushri+muruga+kumar+projects',
    Component: ProjectsPage,
    contentBaseSize: {
      width: 1120,
      height: 640,
    },
  },
  experience: {
    title: '',
    label: 'Experience',
    url: 'http://www.themanubook.com/manushri',
    Component: ExperiencePage,
    contentBaseSize: {
      width: 1100,
      height: 760,
    },
  },
  contact: {
    title: '',
    label: 'Contact',
    url: 'http://www.manupress.com/contact',
    Component: ContactPage,
    contentBaseSize: {
      width: 1024,
      height: 760,
    },
  },
  resume: {
    title: '',
    label: 'Resume',
    url: 'https://www.manushri.dev/resume',
    Component: ResumePage,
  },
} satisfies Record<string, BrowserPageConfig>;

export type BrowserPageKey = keyof typeof BROWSER_PAGES;
