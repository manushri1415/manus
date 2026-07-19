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
import { SnakeGame } from '@/components/games/SnakeGame';
import { Image as ImageIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const TASKBAR_HEIGHT = 32;
const WORKSPACE_PADDING = 16;
const MOBILE_WORKSPACE_PADDING = 8;
const MOBILE_TERMINAL_TOP_GAP = 12;
const MOBILE_TERMINAL_BOTTOM_CLEARANCE = 52;
const DEFAULT_BROWSER_WIDTH = 980;
const DEFAULT_BROWSER_HEIGHT = 700;
const DEFAULT_MIN_BROWSER_WIDTH = 560;
const DEFAULT_MIN_BROWSER_HEIGHT = 460;
const DEFAULT_GAME_WIDTH = 500;
const DEFAULT_GAME_HEIGHT = 560;
const DEFAULT_MIN_GAME_WIDTH = 420;
const DEFAULT_MIN_GAME_HEIGHT = 470;
const DESKTOP_ICON_GUTTER = 120;
const PHONE_LAYOUT_BREAKPOINT = 540;
const TABLET_LAYOUT_BREAKPOINT = 768;
const TOUCH_TABLET_BREAKPOINT = 1280;
const COMPACT_DESKTOP_BREAKPOINT = 1180;
const COMPACT_DESKTOP_HEIGHT = 720;

type WorkspaceSize = {
  width: number;
  height: number;
};

type WindowFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type HomeLayoutMode = 'desktop' | 'laptop' | 'tablet' | 'phone';

type HomeWindowLayout = {
  mode: HomeLayoutMode;
  workspace: WindowFrame;
  terminal: WindowFrame;
  welcomeVariant: 'desktop' | 'tablet' | 'mobile';
  terminalCompact: boolean;
};

type DesktopWindowKey = 'terminal' | 'browser' | 'game';

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

type GameWindowState = {
  isOpen: boolean;
  isMinimized: boolean;
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

const createDefaultGameWindowState = (): GameWindowState => ({
  isOpen: false,
  isMinimized: false,
  initialPosition: { x: 80, y: 32 },
  initialSize: { width: DEFAULT_GAME_WIDTH, height: DEFAULT_GAME_HEIGHT },
});

const getDefaultWindowStack = (): DesktopWindowKey[] => ['terminal'];

const clampValue = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
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

const getHomeWindowLayout = (
  workspaceSize: WorkspaceSize,
  mobileIconAreaHeight: number,
  preferTouchLayout: boolean,
): HomeWindowLayout => {
  const mode: HomeLayoutMode = workspaceSize.width < PHONE_LAYOUT_BREAKPOINT
    ? 'phone'
    : workspaceSize.width < TABLET_LAYOUT_BREAKPOINT || (preferTouchLayout && workspaceSize.width < TOUCH_TABLET_BREAKPOINT)
      ? 'tablet'
      : workspaceSize.width < COMPACT_DESKTOP_BREAKPOINT || workspaceSize.height < COMPACT_DESKTOP_HEIGHT
        ? 'laptop'
        : 'desktop';

  if (mode === 'phone' || mode === 'tablet') {
    const workspaceY = mobileIconAreaHeight + MOBILE_TERMINAL_TOP_GAP;
    const workspaceHeight = Math.max(
      0,
      workspaceSize.height - mobileIconAreaHeight - MOBILE_TERMINAL_TOP_GAP - MOBILE_TERMINAL_BOTTOM_CLEARANCE,
    );
    const workspace = {
      x: 0,
      y: workspaceY,
      width: workspaceSize.width,
      height: workspaceHeight,
    };

    if (mode === 'phone') {
      return {
        mode,
        workspace,
        terminal: {
          x: 0,
          y: 0,
          width: workspace.width,
          height: Math.round(clampValue(workspace.height, 250, Math.min(440, workspace.height))),
        },
        welcomeVariant: 'mobile',
        terminalCompact: true,
      };
    }

    const terminalHeight = Math.round(clampValue(workspace.height * 0.56, 280, Math.min(380, workspace.height)));

    return {
      mode,
      workspace,
      terminal: {
        x: 0,
        y: 0,
        width: workspace.width,
        height: terminalHeight,
      },
      welcomeVariant: 'tablet',
      terminalCompact: false,
    };
  }

  const workspace = {
    x: DESKTOP_ICON_GUTTER,
    y: 8,
    width: Math.max(0, workspaceSize.width - DESKTOP_ICON_GUTTER),
    height: Math.max(0, workspaceSize.height - 12),
  };
  const rightMargin = mode === 'desktop' ? 10 : 6;
  const terminalX = mode === 'desktop'
    ? Math.round(clampValue(workspace.width * 0.06, 18, 52))
    : 18;
  const terminalMaxWidth = mode === 'desktop' ? 1180 : 920;
  const terminalWidth = Math.round(
    clampValue(
      workspace.width * (mode === 'desktop' ? 0.8 : 0.78),
      mode === 'desktop' ? 700 : 560,
      Math.min(terminalMaxWidth, workspace.width - terminalX - rightMargin),
    ),
  );
  const rawTerminalHeight = Math.round(
    clampValue(workspace.height * (mode === 'desktop' ? 0.8 : 0.76), 460, mode === 'desktop' ? 680 : 600),
  );
  const terminalHeight = Math.min(rawTerminalHeight, Math.max(460, workspace.height - 20));
  const terminalY = Math.round(clampValue(workspace.height * (mode === 'desktop' ? 0.09 : 0.11), 20, 60));

  return {
    mode,
    workspace,
    terminal: {
      x: terminalX,
      y: terminalY,
      width: terminalWidth,
      height: terminalHeight,
    },
    welcomeVariant: 'desktop',
    terminalCompact: false,
  };
};

const Index = () => {
  const isMobile = useIsMobile();
  const DEFAULT_WALLPAPER = `${import.meta.env.BASE_URL}frieren.jpg`;
  const resumePdfPath = `${import.meta.env.BASE_URL}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;

  const [currentTheme, setCurrentTheme] = useState('cmd');
  const [wallpaper, setWallpaper] = useState<string | null>(DEFAULT_WALLPAPER);
  const [time] = useState(new Date('2005-02-15T09:19:00'));
  const [appState, setAppState] = useState<'booting' | 'desktop'>('booting');
  const [browserWindow, setBrowserWindow] = useState<BrowserWindowState>(createDefaultBrowserWindowState);
  const [gameWindow, setGameWindow] = useState<GameWindowState>(createDefaultGameWindowState);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [windowStack, setWindowStack] = useState<DesktopWindowKey[]>(getDefaultWindowStack);
  const terminalRef = useRef<TerminalHandle | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceSize, setWorkspaceSize] = useState<WorkspaceSize>(getInitialWorkspaceSize);
  const [isCoarsePointer, setIsCoarsePointer] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(pointer: coarse)').matches;
  });
  const usesTouchOptimizedLayout = isMobile || isCoarsePointer;
  const mobileIconCount = 6;
  const mobileIconColumns = !usesTouchOptimizedLayout
    ? 6
    : workspaceSize.width >= 480
      ? 6
      : workspaceSize.width >= 260
        ? 3
        : 2;
  const mobileIconRows = Math.ceil(mobileIconCount / mobileIconColumns);
  const mobileIconAreaHeight = 28 + mobileIconRows * 78;
  const homeLayout = getHomeWindowLayout(workspaceSize, mobileIconAreaHeight, usesTouchOptimizedLayout);
  const isCompactViewport = homeLayout.mode === 'phone' || homeLayout.mode === 'tablet';
  const terminalWorkspaceSize = {
    width: homeLayout.workspace.width,
    height: homeLayout.workspace.height,
  };
  const appWorkspace = isCompactViewport
    ? {
      x: 0,
      y: 0,
      width: workspaceSize.width,
      height: workspaceSize.height,
    }
    : homeLayout.workspace;
  const appWindowWorkspaceSize = {
    width: appWorkspace.width,
    height: appWorkspace.height,
  };

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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updatePointerMode = () => {
      setIsCoarsePointer(mediaQuery.matches);
    };

    updatePointerMode();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePointerMode);
      return () => mediaQuery.removeEventListener('change', updatePointerMode);
    }

    mediaQuery.addListener(updatePointerMode);
    return () => mediaQuery.removeListener(updatePointerMode);
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

  const restoreDesktopWindows = useCallback(() => {
    setBrowserWindow(createDefaultBrowserWindowState());
    setGameWindow(createDefaultGameWindowState());
    setIsTerminalOpen(true);
    setIsTerminalMinimized(false);
    setWindowStack(getDefaultWindowStack());
  }, []);

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
    restoreDesktopWindows();
    setAppState('booting');
  }, [restoreDesktopWindows]);

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

    if (!appWindowWorkspaceSize.width || !appWindowWorkspaceSize.height) {
      return { size: fallbackSize, position: fallbackPosition };
    }

    if (isCompactViewport) {
      return {
        size: {
          width: appWindowWorkspaceSize.width,
          height: appWindowWorkspaceSize.height,
        },
        position: { x: 0, y: 0 },
      };
    }

    const targetWidth = Math.round(Math.min(preferredSize.width, appWindowWorkspaceSize.width * 0.86));
    const targetHeight = Math.round(Math.min(preferredSize.height, appWindowWorkspaceSize.height * 0.9));
    const width = Math.min(
      appWindowWorkspaceSize.width,
      Math.max(Math.min(minSize.width, appWindowWorkspaceSize.width), targetWidth),
    );
    const height = Math.min(
      appWindowWorkspaceSize.height,
      Math.max(Math.min(minSize.height, appWindowWorkspaceSize.height), targetHeight),
    );
    const maxX = Math.max(0, appWindowWorkspaceSize.width - width);
    const maxY = Math.max(0, appWindowWorkspaceSize.height - height);

    return {
      size: { width, height },
      position: {
        x: Math.round(maxX / 2),
        y: Math.round(maxY / 2),
      },
    };
  }, [appWindowWorkspaceSize.height, appWindowWorkspaceSize.width, isCompactViewport]);

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

  const openSnakeGame = useCallback(() => {
    const fallbackSize = { width: DEFAULT_GAME_WIDTH, height: DEFAULT_GAME_HEIGHT };
    const fallbackPosition = { x: 80, y: 32 };

    if (!appWindowWorkspaceSize.width || !appWindowWorkspaceSize.height) {
      setGameWindow({
        isOpen: true,
        isMinimized: false,
        initialPosition: fallbackPosition,
        initialSize: fallbackSize,
      });
      bringWindowToFront('game');
      return;
    }

    if (isCompactViewport) {
      setGameWindow({
        isOpen: true,
        isMinimized: false,
        initialPosition: { x: 0, y: 0 },
        initialSize: {
          width: appWindowWorkspaceSize.width,
          height: appWindowWorkspaceSize.height,
        },
      });
      bringWindowToFront('game');
      return;
    }

    const width = Math.min(
      appWindowWorkspaceSize.width,
      Math.max(DEFAULT_MIN_GAME_WIDTH, Math.round(Math.min(DEFAULT_GAME_WIDTH, appWindowWorkspaceSize.width * 0.72))),
    );
    const height = Math.min(
      appWindowWorkspaceSize.height,
      Math.max(DEFAULT_MIN_GAME_HEIGHT, Math.round(Math.min(DEFAULT_GAME_HEIGHT, appWindowWorkspaceSize.height * 0.82))),
    );

    setGameWindow({
      isOpen: true,
      isMinimized: false,
      initialPosition: {
        x: Math.max(0, Math.round((appWindowWorkspaceSize.width - width) / 2)),
        y: Math.max(0, Math.round((appWindowWorkspaceSize.height - height) / 2)),
      },
      initialSize: { width, height },
    });

    bringWindowToFront('game');
  }, [appWindowWorkspaceSize.height, appWindowWorkspaceSize.width, bringWindowToFront, isCompactViewport]);

  const handleBrowserClose = useCallback(() => {
    setBrowserWindow(createDefaultBrowserWindowState());
    setWindowStack((prev) => prev.filter((key) => key !== 'browser'));
  }, []);

  const handleGameClose = useCallback(() => {
    setGameWindow(createDefaultGameWindowState());
    setWindowStack((prev) => prev.filter((key) => key !== 'game'));
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
    setBrowserWindow((prev) => (
      prev.isOpen
        ? { ...prev, isMinimized: value }
        : prev
    ));

    if (!value) {
      bringWindowToFront('browser');
    }
  }, [bringWindowToFront]);

  const handleGameMinimize = useCallback((value: boolean) => {
    setGameWindow((prev) => (
      prev.isOpen
        ? { ...prev, isMinimized: value }
        : prev
    ));

    if (!value) {
      bringWindowToFront('game');
    }
  }, [bringWindowToFront]);

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

  const handleTerminalFocus = useCallback(() => {
    bringWindowToFront('terminal');
  }, [bringWindowToFront]);

  const handleTerminalClose = useCallback(() => {
    setIsTerminalOpen(false);
    setIsTerminalMinimized(false);
    setWindowStack((prev) => prev.filter((key) => key !== 'terminal'));
  }, []);

  const handleResumeOpen = useCallback(() => {
    window.open(resumePdfPath, '_blank', 'noopener,noreferrer');
  }, [resumePdfPath]);

  const handleIconClick = useCallback((command: string) => {
    if (command === 'terminal') {
      setIsTerminalOpen(true);
      setIsTerminalMinimized(false);
      bringWindowToFront('terminal');
      return;
    }

    if (command === 'resume') {
      handleResumeOpen();
      return;
    }

    if (command === 'play') {
      openSnakeGame();
      return;
    }

    if (command in BROWSER_PAGES) {
      openBrowserPage(command as BrowserPageKey);
      return;
    }

    if (terminalRef.current) {
      terminalRef.current.executeExternalCommand(command);
    }
  }, [bringWindowToFront, handleResumeOpen, openBrowserPage, openSnakeGame]);

  const currentBrowserPageKey =
    browserWindow.historyIndex >= 0 ? browserWindow.history[browserWindow.historyIndex] ?? null : null;
  const currentBrowserPage = currentBrowserPageKey ? BROWSER_PAGES[currentBrowserPageKey] : null;
  const canGoBack = browserWindow.historyIndex > 0;
  const canGoForward =
    browserWindow.historyIndex >= 0 && browserWindow.historyIndex < browserWindow.history.length - 1;

  const activeWindow = [...windowStack].reverse().find((windowKey) => {
    switch (windowKey) {
      case 'terminal':
        return isTerminalOpen && !isTerminalMinimized;
      case 'browser':
        return browserWindow.isOpen && !browserWindow.isMinimized;
      case 'game':
        return gameWindow.isOpen && !gameWindow.isMinimized;
      default:
        return false;
    }
  }) ?? null;

  const getWindowZIndex = useCallback((windowKey: DesktopWindowKey) => {
    const stackIndex = windowStack.indexOf(windowKey);
    return 10 + Math.max(0, stackIndex);
  }, [windowStack]);

  const handleTaskbarBrowserClick = useCallback(() => {
    if (!browserWindow.isOpen || usesTouchOptimizedLayout) {
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
  }, [activeWindow, browserWindow.isMinimized, browserWindow.isOpen, bringWindowToFront, usesTouchOptimizedLayout]);

  const handleTaskbarGameClick = useCallback(() => {
    if (!gameWindow.isOpen || usesTouchOptimizedLayout) {
      return;
    }

    if (gameWindow.isMinimized) {
      setGameWindow((prev) => ({ ...prev, isMinimized: false }));
      bringWindowToFront('game');
      return;
    }

    if (activeWindow === 'game') {
      setGameWindow((prev) => ({ ...prev, isMinimized: true }));
      return;
    }

    setGameWindow((prev) => ({ ...prev, isMinimized: false }));
    bringWindowToFront('game');
  }, [activeWindow, bringWindowToFront, gameWindow.isMinimized, gameWindow.isOpen, usesTouchOptimizedLayout]);

  const handleTaskbarTerminalClick = useCallback(() => {
    if (!isTerminalOpen) {
      return;
    }

    if (usesTouchOptimizedLayout) {
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
  }, [activeWindow, bringWindowToFront, isTerminalMinimized, isTerminalOpen, usesTouchOptimizedLayout]);

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
        isMobile={usesTouchOptimizedLayout}
        mobileColumns={mobileIconColumns}
      />

      <main
        className="relative z-10 overflow-hidden pointer-events-none"
        style={{ height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }}
      >
        <div
          ref={workspaceRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            padding: isCompactViewport ? 0 : `${WORKSPACE_PADDING}px`,
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${homeLayout.workspace.x}px`,
              top: `${homeLayout.workspace.y}px`,
              width: `${homeLayout.workspace.width}px`,
              height: `${homeLayout.workspace.height}px`,
            }}
          >
            {isTerminalOpen && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${homeLayout.terminal.x}px`,
                  top: `${homeLayout.terminal.y}px`,
                  zIndex: getWindowZIndex('terminal'),
                }}
              >
                <Terminal
                  ref={terminalRef}
                  themeId={currentTheme}
                  workspaceSize={terminalWorkspaceSize}
                  preferredSize={{
                    width: homeLayout.terminal.width,
                    height: homeLayout.terminal.height,
                  }}
                  isMinimized={isTerminalMinimized}
                  onMinimizedChange={setIsTerminalMinimized}
                  onFocus={handleTerminalFocus}
                  onClose={handleTerminalClose}
                  onReboot={restoreDesktopWindows}
                  zIndex={getWindowZIndex('terminal')}
                  isCompactMobile={homeLayout.terminalCompact}
                  welcomeVariant={homeLayout.welcomeVariant}
                  showInitialHelp={false}
                  showCompactCloseButton={homeLayout.mode === 'phone'}
                  onPlay={openSnakeGame}
                />
              </div>
            )}
          </div>

          <div
            className="absolute pointer-events-none"
            style={{
              left: `${appWorkspace.x}px`,
              top: `${appWorkspace.y}px`,
              width: `${appWorkspace.width}px`,
              height: `${appWorkspace.height}px`,
            }}
          >
            {browserWindow.isOpen && currentBrowserPage && (
              <BrowserWindow
                title={currentBrowserPage.title || `${currentBrowserPage.label} - Microsoft Internet Explorer`}
                url={currentBrowserPage.url}
                initialPosition={browserWindow.initialPosition}
                initialSize={browserWindow.initialSize}
                workspaceSize={appWindowWorkspaceSize}
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
                mobileFullScreen={workspaceSize.width <= 600}
              >
                <div key={`${currentBrowserPageKey}:${browserWindow.refreshKey}`} className="h-full">
                  {renderBrowserPage()}
                </div>
              </BrowserWindow>
            )}

            {gameWindow.isOpen && (
              <BrowserWindow
                title="Snake.exe"
                url="arcade://snake"
                initialPosition={gameWindow.initialPosition}
                initialSize={gameWindow.initialSize}
                workspaceSize={appWindowWorkspaceSize}
                minSize={{ width: DEFAULT_MIN_GAME_WIDTH, height: DEFAULT_MIN_GAME_HEIGHT }}
                chromeMode="utility"
                bodyClassName="overflow-hidden"
                bodyStyle={{ backgroundColor: '#050805' }}
                zIndex={getWindowZIndex('game')}
                isMinimized={gameWindow.isMinimized}
                onMinimizedChange={handleGameMinimize}
                onFocus={() => bringWindowToFront('game')}
                onClose={handleGameClose}
                mobileFullScreen={isCompactViewport}
              >
                <SnakeGame isWindowActive={activeWindow === 'game'} isCompactViewport={isCompactViewport} />
              </BrowserWindow>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-[32px] items-stretch border-t border-[#7abaf8] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_45%,var(--xp-blue-dark)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
        <SocialLinks
          onReset={handleReset}
          onOpenPage={openBrowserPage}
          onOpenGame={openSnakeGame}
          onPowerOff={handlePowerOff}
          isMobile={usesTouchOptimizedLayout}
        />

        <div className="min-w-0 flex-1 border-l border-[#3e74df] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_50%,var(--xp-blue-dark)_100%)]">
          {!usesTouchOptimizedLayout && (
            <div className="flex h-full items-center gap-1 overflow-x-auto px-1">
              {isTerminalOpen && (
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
              )}

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

              {gameWindow.isOpen && (
                <button
                  onClick={handleTaskbarGameClick}
                  className="flex h-[24px] min-w-0 max-w-[220px] flex-shrink-0 items-center rounded-sm border px-2 text-[11px] font-semibold text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.35)]"
                  style={{
                    background: activeWindow === 'game'
                      ? 'linear-gradient(180deg, #3d89ff 0%, #2f6be6 48%, #1f49b9 100%)'
                      : 'linear-gradient(180deg, #4e8df2 0%, #336ed7 50%, #2451be 100%)',
                    borderColor: activeWindow === 'game' ? '#173b94' : '#2b58bc',
                    opacity: gameWindow.isMinimized ? 0.82 : 1,
                  }}
                >
                  <span className="truncate">Snake.exe</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-stretch border-l border-[#6bc6fb] bg-[linear-gradient(180deg,var(--xp-blue-light)_0%,var(--xp-blue)_45%,var(--xp-blue-dark)_100%)] shadow-[inset_1px_0_0_rgba(255,255,255,0.35)]">
          <label className={`flex cursor-pointer items-center border-r border-[#51b8f2] ${usesTouchOptimizedLayout ? 'px-2.5' : 'px-3'} text-white/90 transition-colors hover:bg-white/10`}>
            <ImageIcon className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleWallpaperUpload}
            />
          </label>

          <div className={`select-none ${usesTouchOptimizedLayout ? 'px-2.5 text-[10px]' : 'px-4 text-[11px]'} py-[3px] text-right font-sans font-medium leading-tight text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.45)]`}>
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
