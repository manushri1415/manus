import { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal } from '@/components/Terminal';
import { SocialLinks } from '@/components/SocialLinks';
import { BootSequence } from '@/components/BootSequence';
import { LoginScreen } from '@/components/LoginScreen';
import { DesktopIcons } from '@/components/DesktopIcons';
import { BrowserWindow } from '@/components/browser/BrowserWindow';
import { BROWSER_PAGES, type BrowserPageKey } from '@/components/browser/pages/registry';
import { ExperiencePage } from '@/components/browser/pages/ExperiencePage';
import { ContactPage } from '@/components/browser/pages/ContactPage';

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

  useEffect(() => {
    const savedWallpaper = localStorage.getItem('terminal-wallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
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
      <main className="h-[calc(100vh-40px)] relative flex items-center justify-center p-4 overflow-hidden z-10 pointer-events-none">
        <div className="w-full max-w-4xl h-full flex items-center justify-center pointer-events-auto">
          <Terminal ref={terminalRef} themeId={currentTheme} />
        </div>

        {/* Browser Windows */}
        {openWindows.map((pageKey, idx) => {
          const page = BROWSER_PAGES[pageKey];
          if (!page) return null;
          const { Component } = page;
          return (
            <div key={pageKey} className="absolute pointer-events-auto">
              <BrowserWindow
                title={page.title}
                url={page.url}
                initialPosition={{ x: 40 + idx * 40, y: 40 + idx * 40 }}
                initialSize={{ width: 1050, height: 580 }}
                windowKey={pageKey}
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
                ) : (
                  <Component />
                )}
              </BrowserWindow>
            </div>
          );
        })}
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
