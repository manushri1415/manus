import { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal } from '@/components/Terminal';
import { SocialLinks } from '@/components/SocialLinks';
import { BootSequence } from '@/components/BootSequence';
import { LoginScreen } from '@/components/LoginScreen';
import { DesktopIcons } from '@/components/DesktopIcons';
import { BrowserWindow } from '@/components/browser/BrowserWindow';
import { BROWSER_PAGES, type BrowserPageKey } from '@/components/browser/pages/registry';
import { AboutPage } from '@/components/browser/pages/AboutPage';
import { ExperiencePage } from '@/components/browser/pages/ExperiencePage';
import { ContactPage } from '@/components/browser/pages/ContactPage';

const TASKBAR_HEIGHT = 40;
const WORKSPACE_PADDING = 16;
const BROWSER_CHROME_HEIGHT = 62;
const DEFAULT_BROWSER_WIDTH = 920;
const DEFAULT_BROWSER_HEIGHT = 580;
const MIN_BROWSER_WIDTH = 680;
const MIN_BROWSER_HEIGHT = 420;

type WorkspaceSize = {
  width: number;
  height: number;
};

const getInitialWorkspaceSize = (): WorkspaceSize => {
  if (typeof window === 'undefined') {
    return { width: 1050, height: 580 };
  }

  return {
    width: Math.max(0, window.innerWidth - WORKSPACE_PADDING * 2),
    height: Math.max(0, window.innerHeight - TASKBAR_HEIGHT - WORKSPACE_PADDING * 2),
  };
};

const Index = () => {
  // Resolve the correct path for the default wallpaper based on the base URL
  const DEFAULT_WALLPAPER = `${import.meta.env.BASE_URL}frieren.jpg`;

  const [currentTheme, setCurrentTheme] = useState('powershell');
  const [wallpaper, setWallpaper] = useState<string | null>(DEFAULT_WALLPAPER);
  const [time] = useState(new Date('2005-02-15T09:19:00'));
  const [appState, setAppState] = useState<'booting' | 'login' | 'desktop'>('booting');
  const [openWindows, setOpenWindows] = useState<BrowserPageKey[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<BrowserPageKey>>(new Set());
  const terminalRef = useRef<any>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceSize, setWorkspaceSize] = useState<WorkspaceSize>(getInitialWorkspaceSize);

  useEffect(() => {
    const savedWallpaper = localStorage.getItem('terminal-wallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
  }, []);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const updateWorkspaceSize = () => {
      setWorkspaceSize({
        width: workspace.clientWidth,
        height: workspace.clientHeight,
      });
    };

    updateWorkspaceSize();

    const resizeObserver = new ResizeObserver(updateWorkspaceSize);
    resizeObserver.observe(workspace);
    window.addEventListener('resize', updateWorkspaceSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWorkspaceSize);
    };
  }, []);

  const handleWallpaperChange = useCallback((newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('terminal-wallpaper', newWallpaper);
  }, []);

  const handleReset = useCallback(() => {
    localStorage.clear();
    setWallpaper(DEFAULT_WALLPAPER);
    setCurrentTheme('powershell');
    window.location.reload();
  }, [DEFAULT_WALLPAPER]);

  const handleBootComplete = useCallback(() => {
    setAppState('login');
  }, []);

  const handleLogin = useCallback(() => {
    setAppState('desktop');
  }, []);

  const handleLogout = useCallback(() => {
    setAppState('login');
  }, []);

  const openOrFocusPage = useCallback((pageKey: BrowserPageKey) => {
    setOpenWindows((prev) => {
      const filtered = prev.filter((k) => k !== pageKey);
      return [...filtered, pageKey];
    });
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(pageKey);
      return next;
    });
  }, []);

  const handleWindowClose = useCallback((pageKey: BrowserPageKey) => {
    setOpenWindows((prev) => prev.filter((k) => k !== pageKey));
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(pageKey);
      return next;
    });
  }, []);

  const handleWindowFocus = useCallback((pageKey: BrowserPageKey) => {
    setOpenWindows((prev) => {
      const filtered = prev.filter((k) => k !== pageKey);
      return [...filtered, pageKey];
    });
  }, []);

  const handleWindowMinimize = useCallback((pageKey: BrowserPageKey, value: boolean) => {
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      if (value) {
        next.add(pageKey);
      } else {
        next.delete(pageKey);
      }
      return next;
    });
  }, []);

  const handleIconClick = useCallback((command: string) => {
    if (command in BROWSER_PAGES) {
      openOrFocusPage(command as BrowserPageKey);
    } else if (terminalRef.current) {
      terminalRef.current.executeExternalCommand(command);
    }
  }, [openOrFocusPage]);

  const getInitialWindowState = useCallback((pageKey: BrowserPageKey) => {
    const fallbackSize = { width: DEFAULT_BROWSER_WIDTH, height: DEFAULT_BROWSER_HEIGHT };
    const fallbackPosition = { x: 40, y: 40 };
    const page = BROWSER_PAGES[pageKey];

    if (!workspaceSize.width || !workspaceSize.height) {
      return { size: fallbackSize, position: fallbackPosition };
    }

    const width = Math.round(Math.min(DEFAULT_BROWSER_WIDTH, workspaceSize.width));
    const contentBaseSize = page?.contentBaseSize;
    const widthScale = contentBaseSize
      ? Math.min(width / contentBaseSize.width, 1)
      : 1;
    const preferredHeight = contentBaseSize
      ? Math.round(contentBaseSize.height * widthScale + BROWSER_CHROME_HEIGHT)
      : DEFAULT_BROWSER_HEIGHT;
    const height = Math.round(
      Math.max(
        Math.min(MIN_BROWSER_HEIGHT, workspaceSize.height),
        Math.min(preferredHeight, workspaceSize.height)
      )
    );

    const maxX = Math.max(0, workspaceSize.width - width);
    const maxY = Math.max(0, workspaceSize.height - height);

    return {
      size: { width, height },
      position: {
        x: Math.round(maxX / 2),
        y: Math.round(maxY / 2),
      },
    };
  }, [workspaceSize]);

  if (appState === 'booting') {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  if (appState === 'login') {
    return (
      <LoginScreen
        wallpaper={wallpaper}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div
      className="h-screen bg-background text-foreground relative overflow-hidden animate-in fade-in duration-1000"
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay */}
      {wallpaper && (
        <div className="absolute inset-0 bg-black/40 z-0" />
      )}

      {/* Desktop Icons Layer */}
      <DesktopIcons onIconClick={handleIconClick} />

      {/* Main Content (Terminal & Browser Windows) */}
      <main
        className="relative overflow-hidden z-10 pointer-events-none"
        style={{ height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }}
      >
        <div className="relative z-0 flex h-full w-full items-center justify-center p-4 pointer-events-none">
          <div className="w-full max-w-4xl h-full flex items-center justify-center pointer-events-auto">
            <Terminal
              ref={terminalRef}
              themeId={currentTheme}
              onOpenExperience={() => openOrFocusPage('experience')}
              onOpenResume={() => openOrFocusPage('resume')}
            />
          </div>
        </div>

        <div
          ref={workspaceRef}
          className="absolute z-20 pointer-events-none"
          style={{
            inset: `${WORKSPACE_PADDING}px`,
          }}
        >
          {/* Browser Windows */}
          {openWindows.map((pageKey, idx) => {
            const page = BROWSER_PAGES[pageKey];
            if (!page) return null;
            const { Component } = page;
            const initialWindowState = getInitialWindowState(pageKey);

            return (
              <BrowserWindow
                key={pageKey}
                title={page.title}
                url={page.url}
                initialPosition={initialWindowState.position}
                initialSize={initialWindowState.size}
                workspaceSize={workspaceSize}
                contentBaseSize={page.contentBaseSize}
                zIndex={20 + idx}
                isMinimized={minimizedWindows.has(pageKey)}
                onMinimizedChange={(v) => handleWindowMinimize(pageKey, v)}
                onFocus={() => handleWindowFocus(pageKey)}
                onClose={() => handleWindowClose(pageKey)}
              >
                {pageKey === 'experience' ? (
                  <ExperiencePage
                    onClose={() => handleWindowClose('experience')}
                    onNavigate={openOrFocusPage}
                  />
                ) : pageKey === 'contact' ? (
                  <ContactPage
                    onClose={() => handleWindowClose('contact')}
                    onNavigate={openOrFocusPage}
                  />
                ) : pageKey === 'about' ? (
                  <AboutPage
                    onClose={() => handleWindowClose('about')}
                    onNavigate={openOrFocusPage}
                  />
                ) : (
                  <Component />
                )}
              </BrowserWindow>
            );
          })}
        </div>
      </main>

      {/* Windows Taskbar */}
      <footer className="fixed bottom-0 left-0 right-0 h-[40px] bg-[#00122e]/80 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-between px-2 gap-4">
        <SocialLinks
          onThemeChange={setCurrentTheme}
          onWallpaperChange={handleWallpaperChange}
          onReset={handleReset}
          onLogout={handleLogout}
        />

        <div className="flex items-center gap-2 flex-1">
          {openWindows.map((pageKey) => {
            if (!minimizedWindows.has(pageKey)) return null;
            const page = BROWSER_PAGES[pageKey];
            return (
              <button
                key={pageKey}
                onClick={() => handleWindowMinimize(pageKey, false)}
                className="bg-secondary border border-border rounded-t-lg px-3 py-1 cursor-pointer shadow-lg hover:bg-secondary/80 transition-colors flex items-center gap-2 text-xs font-mono"
              >
                <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-white/70 px-4 select-none text-right font-medium flex-shrink-0">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <br />
          {time.toLocaleDateString()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
