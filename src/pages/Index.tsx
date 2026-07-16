import { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react';
import { Terminal } from '@/components/Terminal';
import { SocialLinks } from '@/components/SocialLinks';
import { BootSequence } from '@/components/BootSequence';
import { LoginScreen } from '@/components/LoginScreen';
import { DesktopIcons } from '@/components/DesktopIcons';
import { BrowserWindow } from '@/components/browser/BrowserWindow';
import { BROWSER_PAGES, type BrowserPageKey } from '@/components/browser/pages/registry';
import { AboutPage } from '@/components/browser/pages/AboutPage';
import { ProjectsPage } from '@/components/browser/pages/ProjectsPage';
import { ExperiencePage } from '@/components/browser/pages/ExperiencePage';
import { ContactPage } from '@/components/browser/pages/ContactPage';
import { Image as ImageIcon } from 'lucide-react';

const TASKBAR_HEIGHT = 38;
const WORKSPACE_PADDING = 16;
const DEFAULT_BROWSER_WIDTH = 980;
const DEFAULT_BROWSER_HEIGHT = 700;
const DEFAULT_MIN_BROWSER_WIDTH = 560;
const DEFAULT_MIN_BROWSER_HEIGHT = 460;

type WorkspaceSize = {
  width: number;
  height: number;
};

type DesktopWindowKey = 'terminal' | BrowserPageKey;

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

  const [currentTheme, setCurrentTheme] = useState('cmd');
  const [wallpaper, setWallpaper] = useState<string | null>(DEFAULT_WALLPAPER);
  const [time] = useState(new Date('2005-02-15T09:19:00'));
  const [appState, setAppState] = useState<'booting' | 'login' | 'desktop'>('booting');
  const [openWindows, setOpenWindows] = useState<BrowserPageKey[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<BrowserPageKey>>(new Set());
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [windowStack, setWindowStack] = useState<DesktopWindowKey[]>(['terminal']);
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

  const handleWallpaperUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleWallpaperChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [handleWallpaperChange]);

  const handleReset = useCallback(() => {
    localStorage.clear();
    setWallpaper(DEFAULT_WALLPAPER);
    setCurrentTheme('cmd');
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

  const handlePowerOff = useCallback(() => {
    setOpenWindows([]);
    setMinimizedWindows(new Set());
    setIsTerminalMinimized(false);
    setWindowStack(['terminal']);
    setAppState('booting');
  }, []);

  const bringWindowToFront = useCallback((windowKey: DesktopWindowKey) => {
    setWindowStack((prev) => {
      const filtered = prev.filter((key) => key !== windowKey);
      return [...filtered, windowKey];
    });
  }, []);

  const activateBrowserPage = useCallback((pageKey: BrowserPageKey) => {
    setOpenWindows((prev) => {
      if (prev.includes(pageKey)) {
        return prev;
      }

      return [...prev, pageKey];
    });
    setMinimizedWindows(new Set(openWindows.filter((key) => key !== pageKey)));
    bringWindowToFront(pageKey);
  }, [bringWindowToFront, openWindows]);

  const openOrFocusPage = useCallback((pageKey: BrowserPageKey) => {
    activateBrowserPage(pageKey);
  }, [activateBrowserPage]);

  const handleWindowClose = useCallback((pageKey: BrowserPageKey) => {
    setOpenWindows((prev) => prev.filter((k) => k !== pageKey));
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(pageKey);
      return next;
    });
    setWindowStack((prev) => prev.filter((key) => key !== pageKey));
  }, []);

  const handleWindowFocus = useCallback((pageKey: BrowserPageKey) => {
    activateBrowserPage(pageKey);
  }, [activateBrowserPage]);

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
    if (!value) {
      bringWindowToFront(pageKey);
    }
  }, [bringWindowToFront]);

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
    const preferredSize = page?.preferredWindowSize ?? fallbackSize;
    const minSize = page?.minWindowSize ?? {
      width: DEFAULT_MIN_BROWSER_WIDTH,
      height: DEFAULT_MIN_BROWSER_HEIGHT,
    };

    if (!workspaceSize.width || !workspaceSize.height) {
      return { size: fallbackSize, position: fallbackPosition };
    }

    const targetWidth = Math.round(Math.min(preferredSize.width, workspaceSize.width * 0.84));
    const targetHeight = Math.round(Math.min(preferredSize.height, workspaceSize.height * 0.9));
    const width = Math.min(
      workspaceSize.width,
      Math.max(Math.min(minSize.width, workspaceSize.width), targetWidth)
    );
    const height = Math.min(
      workspaceSize.height,
      Math.max(Math.min(minSize.height, workspaceSize.height), targetHeight)
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

  const activeWindow = [...windowStack].reverse().find((windowKey) => {
    if (windowKey === 'terminal') {
      return !isTerminalMinimized;
    }

    return openWindows.includes(windowKey) && !minimizedWindows.has(windowKey);
  }) ?? null;

  const getWindowZIndex = useCallback((windowKey: DesktopWindowKey) => {
    const stackIndex = windowStack.indexOf(windowKey);
    return 10 + Math.max(0, stackIndex);
  }, [windowStack]);

  const handleTaskbarWindowClick = useCallback((pageKey: BrowserPageKey) => {
    if (activeWindow === pageKey) {
      handleWindowMinimize(pageKey, true);
      return;
    }

    activateBrowserPage(pageKey);
  }, [activeWindow, activateBrowserPage, handleWindowMinimize]);

  const handleTerminalFocus = useCallback(() => {
    bringWindowToFront('terminal');
  }, [bringWindowToFront]);

  const handleTaskbarTerminalClick = useCallback(() => {
    if (isTerminalMinimized) {
      setIsTerminalMinimized(false);
      bringWindowToFront('terminal');
      return;
    }

    if (activeWindow === 'terminal') {
      setIsTerminalMinimized(true);
      return;
    }

    bringWindowToFront('terminal');
  }, [activeWindow, bringWindowToFront, isTerminalMinimized]);

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
          <div className="flex h-full w-full items-center justify-center">
            <Terminal
              ref={terminalRef}
              themeId={currentTheme}
              workspaceSize={workspaceSize}
              isMinimized={isTerminalMinimized}
              onMinimizedChange={setIsTerminalMinimized}
              onFocus={handleTerminalFocus}
              zIndex={getWindowZIndex('terminal')}
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
          {openWindows.map((pageKey) => {
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
                minSize={page.minWindowSize}
                zIndex={getWindowZIndex(pageKey)}
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
                ) : pageKey === 'projects' ? (
                  <ProjectsPage onNavigate={openOrFocusPage} />
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
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-[32px] items-stretch border-t border-[#7abaf8] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_45%,var(--xp-blue-dark)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
        <SocialLinks
          onReset={handleReset}
          onLogout={handleLogout}
          onOpenPage={openOrFocusPage}
          onPowerOff={handlePowerOff}
        />

        <div className="min-w-0 flex-1 border-l border-[#3e74df] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_50%,var(--xp-blue-dark)_100%)]">
          <div className="flex h-full items-center gap-1 overflow-x-auto px-1">
            <button
              onClick={handleTaskbarTerminalClick}
              className="flex h-[24px] min-w-0 max-w-[220px] flex-shrink-0 items-center rounded-sm border px-2 text-[11px] font-semibold text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.35)]"
              style={{
                background: activeWindow === 'terminal'
                  ? 'linear-gradient(180deg, #3d89ff 0%, #2f6be6 48%, #1f49b9 100%)'
                  : 'linear-gradient(180deg, #4e8df2 0%, #336ed7 50%, #2451be 100%)',
                borderColor: activeWindow === 'terminal' ? '#173b94' : '#2b58bc',
                opacity: isTerminalMinimized ? 0.82 : 1,
              }}
            >
              <span className="truncate">Terminal (Guest@Portfolio)</span>
            </button>

            {openWindows.map((pageKey) => {
              const page = BROWSER_PAGES[pageKey];
              const isActive = activeWindow === pageKey;

              return (
                <button
                  key={pageKey}
                  onClick={() => handleTaskbarWindowClick(pageKey)}
                  className="flex h-[24px] min-w-0 max-w-[220px] flex-shrink-0 items-center rounded-sm border px-2 text-[11px] font-semibold text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.35)]"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, #3d89ff 0%, #2f6be6 48%, #1f49b9 100%)'
                      : 'linear-gradient(180deg, #4e8df2 0%, #336ed7 50%, #2451be 100%)',
                    borderColor: isActive ? '#173b94' : '#2b58bc',
                    opacity: minimizedWindows.has(pageKey) ? 0.82 : 1,
                  }}
                >
                  <span className="truncate">{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-stretch border-l border-[#6bc6fb] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_45%,var(--xp-blue-dark)_100%)] shadow-[inset_1px_0_0_rgba(255,255,255,0.35)]">
          <label className="flex cursor-pointer items-center border-r border-[#51b8f2] px-3 text-white/90 transition-colors hover:bg-white/10">
            <ImageIcon className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleWallpaperUpload}
            />
          </label>

          <div className="select-none px-4 py-[3px] text-right font-sans text-[11px] font-medium leading-tight text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.45)]">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <br />
            {time.toLocaleDateString()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
