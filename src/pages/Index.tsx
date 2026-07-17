import { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react';
import { Terminal, type TerminalHandle } from '@/components/Terminal';
import { SocialLinks } from '@/components/SocialLinks';
import { BootSequence } from '@/components/BootSequence';
import { DesktopIcons } from '@/components/DesktopIcons';
import { BrowserWindow } from '@/components/browser/BrowserWindow';
import { BROWSER_PAGES, type BrowserPageKey } from '@/components/browser/pages/registry';
import { AboutPage } from '@/components/browser/pages/AboutPage';
import { ProjectsPage } from '@/components/browser/pages/ProjectsPage';
import { ExperiencePage } from '@/components/browser/pages/ExperiencePage';
import { ContactPage } from '@/components/browser/pages/ContactPage';
import { Image as ImageIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const TASKBAR_HEIGHT = 38;
const WORKSPACE_PADDING = 16;
const MOBILE_WORKSPACE_PADDING = 8;
const MOBILE_TERMINAL_TOP_GAP = 12;
const MOBILE_TERMINAL_BOTTOM_CLEARANCE = 52;
const DEFAULT_BROWSER_WIDTH = 980;
const DEFAULT_BROWSER_HEIGHT = 700;
const DEFAULT_MIN_BROWSER_WIDTH = 560;
const DEFAULT_MIN_BROWSER_HEIGHT = 460;

type WorkspaceSize = {
  width: number;
  height: number;
};

type DesktopWindowKey = 'terminal' | 'browser';

type BrowserWindowState = {
  isOpen: boolean;
  isMinimized: boolean;
  history: BrowserPageKey[];
  historyIndex: number;
  refreshKey: number;
  initialPosition: {
    x: number;
    y: number;
  };
  initialSize: {
    width: number;
    height: number;
  };
};

const createDefaultBrowserWindowState = (): BrowserWindowState => ({
  isOpen: false,
  isMinimized: false,
  history: [],
  historyIndex: -1,
  refreshKey: 0,
  initialPosition: { x: 40, y: 40 },
  initialSize: { width: DEFAULT_BROWSER_WIDTH, height: DEFAULT_BROWSER_HEIGHT },
});

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
  const isMobile = useIsMobile();
  const DEFAULT_WALLPAPER = `${import.meta.env.BASE_URL}frieren.jpg`;

  const [currentTheme, setCurrentTheme] = useState('cmd');
  const [wallpaper, setWallpaper] = useState<string | null>(DEFAULT_WALLPAPER);
  const [time] = useState(new Date('2005-02-15T09:19:00'));
  const [appState, setAppState] = useState<'booting' | 'desktop'>('booting');
  const [browserWindow, setBrowserWindow] = useState<BrowserWindowState>(createDefaultBrowserWindowState);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [windowStack, setWindowStack] = useState<DesktopWindowKey[]>(['terminal']);
  const terminalRef = useRef<TerminalHandle | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceSize, setWorkspaceSize] = useState<WorkspaceSize>(getInitialWorkspaceSize);
  const mobileIconCount = 6;
  const mobileIconColumns = !isMobile
    ? 6
    : workspaceSize.width >= 480
      ? 6
      : workspaceSize.width >= 260
        ? 3
        : 2;
  const mobileIconRows = Math.ceil(mobileIconCount / mobileIconColumns);
  const mobileIconAreaHeight = 28 + mobileIconRows * 78;
  const mobileTerminalTopInset = mobileIconAreaHeight + MOBILE_TERMINAL_TOP_GAP;
  const mobileTerminalAvailableHeight = isMobile
    ? Math.max(
      0,
      workspaceSize.height - mobileIconAreaHeight - MOBILE_TERMINAL_TOP_GAP - MOBILE_TERMINAL_BOTTOM_CLEARANCE,
    )
    : workspaceSize.height;
  const terminalWorkspaceSize = isMobile
    ? {
      width: workspaceSize.width,
      height: mobileTerminalAvailableHeight,
    }
    : workspaceSize;

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
    setAppState('desktop');
  }, []);

  const handlePowerOff = useCallback(() => {
    setBrowserWindow(createDefaultBrowserWindowState());
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

    if (isMobile) {
      return {
        size: {
          width: workspaceSize.width,
          height: workspaceSize.height,
        },
        position: { x: 0, y: 0 },
      };
    }

    const targetWidth = Math.round(Math.min(preferredSize.width, workspaceSize.width * 0.84));
    const targetHeight = Math.round(Math.min(preferredSize.height, workspaceSize.height * 0.9));
    const width = Math.min(
      workspaceSize.width,
      Math.max(Math.min(minSize.width, workspaceSize.width), targetWidth),
    );
    const height = Math.min(
      workspaceSize.height,
      Math.max(Math.min(minSize.height, workspaceSize.height), targetHeight),
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
  }, [isMobile, workspaceSize]);

  const openBrowserPage = useCallback((pageKey: BrowserPageKey) => {
    const initialWindowState = getInitialWindowState(pageKey);

    setBrowserWindow((prev) => {
      const currentPage = prev.history[prev.historyIndex];

      if (!prev.isOpen) {
        return {
          isOpen: true,
          isMinimized: false,
          history: [pageKey],
          historyIndex: 0,
          refreshKey: 0,
          initialPosition: initialWindowState.position,
          initialSize: initialWindowState.size,
        };
      }

      if (currentPage === pageKey) {
        return {
          ...prev,
          isMinimized: false,
        };
      }

      const nextHistory = prev.history.slice(0, prev.historyIndex + 1);
      nextHistory.push(pageKey);

      return {
        ...prev,
        isMinimized: false,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
        initialPosition: initialWindowState.position,
        initialSize: initialWindowState.size,
      };
    });

    bringWindowToFront('browser');
  }, [bringWindowToFront, getInitialWindowState]);

  const handleBrowserClose = useCallback(() => {
    setBrowserWindow(createDefaultBrowserWindowState());
    setWindowStack((prev) => prev.filter((key) => key !== 'browser'));
  }, []);

  const handleBrowserFocus = useCallback(() => {
    setBrowserWindow((prev) => (
      prev.isOpen && prev.isMinimized
        ? { ...prev, isMinimized: false }
        : prev
    ));
    bringWindowToFront('browser');
  }, [bringWindowToFront]);

  const handleBrowserMinimize = useCallback((value: boolean) => {
    if (isMobile) return;

    setBrowserWindow((prev) => (
      prev.isOpen
        ? { ...prev, isMinimized: value }
        : prev
    ));

    if (!value) {
      bringWindowToFront('browser');
    }
  }, [bringWindowToFront, isMobile]);

  const handleBrowserBack = useCallback(() => {
    setBrowserWindow((prev) => {
      if (prev.historyIndex <= 0) {
        return prev;
      }

      return {
        ...prev,
        historyIndex: prev.historyIndex - 1,
      };
    });
    bringWindowToFront('browser');
  }, [bringWindowToFront]);

  const handleBrowserForward = useCallback(() => {
    setBrowserWindow((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) {
        return prev;
      }

      return {
        ...prev,
        historyIndex: prev.historyIndex + 1,
      };
    });
    bringWindowToFront('browser');
  }, [bringWindowToFront]);

  const handleBrowserRefresh = useCallback(() => {
    setBrowserWindow((prev) => (
      prev.isOpen
        ? { ...prev, refreshKey: prev.refreshKey + 1 }
        : prev
    ));
    bringWindowToFront('browser');
  }, [bringWindowToFront]);

  const handleIconClick = useCallback((command: string) => {
    if (command === 'terminal') {
      setIsTerminalMinimized(false);
      bringWindowToFront('terminal');
    } else if (command in BROWSER_PAGES) {
      openBrowserPage(command as BrowserPageKey);
    } else if (terminalRef.current) {
      terminalRef.current.executeExternalCommand(command);
    }
  }, [bringWindowToFront, openBrowserPage]);

  const currentBrowserPageKey =
    browserWindow.historyIndex >= 0 ? browserWindow.history[browserWindow.historyIndex] ?? null : null;
  const currentBrowserPage = currentBrowserPageKey ? BROWSER_PAGES[currentBrowserPageKey] : null;
  const canGoBack = browserWindow.historyIndex > 0;
  const canGoForward =
    browserWindow.historyIndex >= 0 && browserWindow.historyIndex < browserWindow.history.length - 1;

  const activeWindow = [...windowStack].reverse().find((windowKey) => {
    if (windowKey === 'terminal') {
      return !isTerminalMinimized;
    }

    return browserWindow.isOpen && !browserWindow.isMinimized;
  }) ?? null;

  const getWindowZIndex = useCallback((windowKey: DesktopWindowKey) => {
    const stackIndex = windowStack.indexOf(windowKey);
    return 10 + Math.max(0, stackIndex);
  }, [windowStack]);

  const handleTaskbarBrowserClick = useCallback(() => {
    if (!browserWindow.isOpen || isMobile) {
      return;
    }

    if (browserWindow.isMinimized) {
      setBrowserWindow((prev) => ({ ...prev, isMinimized: false }));
      bringWindowToFront('browser');
      return;
    }

    if (activeWindow === 'browser') {
      setBrowserWindow((prev) => ({ ...prev, isMinimized: true }));
      return;
    }

    setBrowserWindow((prev) => ({ ...prev, isMinimized: false }));
    bringWindowToFront('browser');
  }, [activeWindow, browserWindow.isMinimized, browserWindow.isOpen, bringWindowToFront, isMobile]);

  const handleTerminalFocus = useCallback(() => {
    bringWindowToFront('terminal');
  }, [bringWindowToFront]);

  const handleTaskbarTerminalClick = useCallback(() => {
    if (isMobile) {
      setIsTerminalMinimized(false);
      bringWindowToFront('terminal');
      return;
    }

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
  }, [activeWindow, bringWindowToFront, isMobile, isTerminalMinimized]);

  const renderBrowserPage = () => {
    switch (currentBrowserPageKey) {
      case 'experience':
        return (
          <ExperiencePage
            onClose={handleBrowserClose}
            onNavigate={openBrowserPage}
          />
        );
      case 'projects':
        return <ProjectsPage onNavigate={openBrowserPage} />;
      case 'contact':
        return (
          <ContactPage
            onClose={handleBrowserClose}
            onNavigate={openBrowserPage}
          />
        );
      case 'about':
        return (
          <AboutPage
            onClose={handleBrowserClose}
            onNavigate={openBrowserPage}
          />
        );
      default:
        return null;
    }
  };

  if (appState === 'booting') {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <div
      className="relative h-screen overflow-hidden bg-background text-foreground animate-in fade-in duration-1000"
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {wallpaper && (
        <div className="absolute inset-0 z-0 bg-black/40" />
      )}

      <DesktopIcons
        onIconClick={handleIconClick}
        isMobile={isMobile}
        mobileColumns={mobileIconColumns}
      />

      <main
        className="relative z-10 overflow-hidden pointer-events-none"
        style={{ height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }}
      >
        <div
          className={`absolute inset-0 pointer-events-none ${isMobile ? 'flex items-center justify-center px-3' : 'flex items-center justify-center p-4'}`}
          style={{
            zIndex: getWindowZIndex('terminal'),
            paddingTop: isMobile ? `${mobileTerminalTopInset}px` : undefined,
            paddingBottom: isMobile ? `${MOBILE_TERMINAL_BOTTOM_CLEARANCE}px` : undefined,
          }}
        >
          <div className={`flex h-full w-full ${isMobile ? 'items-center justify-center' : 'items-center justify-center'}`}>
            <Terminal
              ref={terminalRef}
              themeId={currentTheme}
              workspaceSize={terminalWorkspaceSize}
              isMinimized={isTerminalMinimized}
              onMinimizedChange={setIsTerminalMinimized}
              onFocus={handleTerminalFocus}
              zIndex={getWindowZIndex('terminal')}
              isCompactMobile={isMobile}
              showInitialHelp={!isMobile}
              showCompactCloseButton={isMobile}
            />
          </div>
        </div>

        <div
          ref={workspaceRef}
          className="absolute pointer-events-none"
          style={{
            inset: `${isMobile ? MOBILE_WORKSPACE_PADDING : WORKSPACE_PADDING}px`,
            zIndex: getWindowZIndex('browser'),
          }}
        >
          {browserWindow.isOpen && currentBrowserPage && (
            <BrowserWindow
              title={currentBrowserPage.title || `${currentBrowserPage.label} - Microsoft Internet Explorer`}
              url={currentBrowserPage.url}
              initialPosition={browserWindow.initialPosition}
              initialSize={browserWindow.initialSize}
              workspaceSize={workspaceSize}
              minSize={currentBrowserPage.minWindowSize}
              zIndex={getWindowZIndex('browser')}
              isMinimized={browserWindow.isMinimized}
              onMinimizedChange={handleBrowserMinimize}
              onFocus={handleBrowserFocus}
              onClose={handleBrowserClose}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onBack={handleBrowserBack}
              onForward={handleBrowserForward}
              onRefresh={handleBrowserRefresh}
              mobileFullScreen={isMobile}
            >
              <div key={`${currentBrowserPageKey}:${browserWindow.refreshKey}`} className="h-full">
                {renderBrowserPage()}
              </div>
            </BrowserWindow>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-[32px] items-stretch border-t border-[#7abaf8] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_45%,var(--xp-blue-dark)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
        <SocialLinks
          onReset={handleReset}
          onOpenPage={openBrowserPage}
          onPowerOff={handlePowerOff}
          isMobile={isMobile}
        />

        <div className="min-w-0 flex-1 border-l border-[#3e74df] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_50%,var(--xp-blue-dark)_100%)]">
          {!isMobile && (
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

              {browserWindow.isOpen && (
                <button
                  onClick={handleTaskbarBrowserClick}
                  className="flex h-[24px] min-w-0 max-w-[220px] flex-shrink-0 items-center rounded-sm border px-2 text-[11px] font-semibold text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.35)]"
                  style={{
                    background: activeWindow === 'browser'
                      ? 'linear-gradient(180deg, #3d89ff 0%, #2f6be6 48%, #1f49b9 100%)'
                      : 'linear-gradient(180deg, #4e8df2 0%, #336ed7 50%, #2451be 100%)',
                    borderColor: activeWindow === 'browser' ? '#173b94' : '#2b58bc',
                    opacity: browserWindow.isMinimized ? 0.82 : 1,
                  }}
                >
                  <span className="truncate">Internet Explorer</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-stretch border-l border-[#6bc6fb] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_45%,var(--xp-blue-dark)_100%)] shadow-[inset_1px_0_0_rgba(255,255,255,0.35)]">
          <label className={`flex cursor-pointer items-center border-r border-[#51b8f2] ${isMobile ? 'px-2.5' : 'px-3'} text-white/90 transition-colors hover:bg-white/10`}>
            <ImageIcon className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleWallpaperUpload}
            />
          </label>

          <div className={`select-none ${isMobile ? 'px-2.5 text-[10px]' : 'px-4 text-[11px]'} py-[3px] text-right font-sans font-medium leading-tight text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.45)]`}>
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
