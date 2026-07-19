import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string | ReactNode;
}

type WindowSize = {
  width: number;
  height: number;
};

type WindowPosition = {
  x: number;
  y: number;
};

type WelcomeVariant = 'desktop' | 'tablet' | 'mobile';

export type TerminalHandle = {
  executeExternalCommand: (command: string) => void;
};

type TerminalProps = {
  themeId?: string;
  workspaceSize?: WindowSize;
  preferredSize?: WindowSize;
  isMinimized?: boolean;
  onMinimizedChange?: (value: boolean) => void;
  onFocus?: () => void;
  zIndex?: number;
  isCompactMobile?: boolean;
  showInitialHelp?: boolean;
  showCompactCloseButton?: boolean;
  welcomeVariant?: WelcomeVariant;
  onClose?: () => void;
  onReboot?: () => void;
  onPlay?: () => void;
};

const DESKTOP_WELCOME_MESSAGE = `Hello, and welcome to my OS! :)

I'm Manushri, and I'm genuinely happy you're here.

This portfolio is inspired by early-2000s computers and websites. Instead of using a traditional portfolio template, I built something that feels like opening an old personal computer and wandering through the internet of 2005.

Every icon, window, and page reveals a different part of my projects, experience, personality, and creative interests.

Built with:
React | TypeScript | CSS | curiosity | too much attention to detail

Single-click a desktop icon to begin exploring.
Use the Start menu to view all available programs.

Some parts of the system contain hidden interactions (Easter Eggs!!).

Try typing: help`;

const TABLET_WELCOME_MESSAGE = `MANU OS - PERSONAL SYSTEM
Version 2005.02.15

Hello! I'm Manushri.

This portfolio is a 2005-inspired desktop built to feel like opening an old personal computer instead of a standard template.

Use an app icon to explore my work.
Try typing: help`;

const MOBILE_WELCOME_MESSAGE = `MANU OS - MOBILE MODE

Welcome! I'm Manushri.

This is my 2005-inspired interactive portfolio. I wanted it to feel nostalgic, curious, and a little handmade, like discovering an old machine full of personality.

Tap an app to explore my work.

Try typing: help`;

const HELP_MESSAGE = `Built-in commands:
  help      - Show this command list
  whoami    - Meet the person behind MANU OS
  about-os  - Learn the idea behind this portfolio
  tech      - View the stack and focus areas
  credits   - See inspirations and thank-yous
  cat       - Run a highly important cat process
  fortune   - Print a tiny internet-era fortune
  clear     - Clear the terminal
  reboot    - Restore the default desktop layout
  play      - Launch Snake.exe

Navigation hint:
  Use the desktop icons or Start menu for the full portfolio.`;

const ABOUT_OS_MESSAGE = `ABOUT MANU OS

MANU OS is my portfolio disguised as a personal computer from 2005. I wanted it to feel nostalgic, curious, and a little handmade, like discovering an old machine full of personality.`;

const TECH_MESSAGE = `SYSTEM STACK

Frontend   React | TypeScript | CSS
Focus      Full-stack | Backend | Applied AI
Style      Windows XP energy with modern UX guardrails
Approach   Storytelling, polish, and useful software`;

const CREDITS_MESSAGE = `CREDITS

Inspired by Windows XP, old browsers, desktop toys, and the weird charm of the early internet.

Started with github/iamovi/tfish and edited and made it my own `;

const CAT_MESSAGE = ` /\\_/\\\\
( o.o )  cat.exe is running normally.
 > ^ <   morale increased by 12%`;

const FORTUNE_MESSAGES = [
  'A curious click is usually the right click.',
  'The best portfolios leave a breadcrumb trail.',
  'Old interfaces can still tell new stories.',
  'A hidden command is just a handshake for explorers.',
];

const TERMINAL_MIN_WIDTH = 300;
const TERMINAL_MIN_HEIGHT = 380;
const AUTO_COMPLETE_COMMANDS = ['help', 'whoami', 'about-os', 'tech', 'credits', 'cat', 'fortune', 'clear', 'reboot', 'play'];

const clampValue = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

const isSameWindowSize = (a: WindowSize, b: WindowSize) => a.width === b.width && a.height === b.height;

const isSameWindowPosition = (a: WindowPosition, b: WindowPosition) => a.x === b.x && a.y === b.y;

const getFallbackWorkspaceSize = (): WindowSize => {
  if (typeof window === 'undefined') {
    return { width: 1200, height: 700 };
  }

  return {
    width: Math.max(0, window.innerWidth - 32),
    height: Math.max(0, window.innerHeight - 72),
  };
};

const getWelcomeMessage = (variant: WelcomeVariant) => {
  switch (variant) {
    case 'mobile':
      return MOBILE_WELCOME_MESSAGE;
    case 'tablet':
      return TABLET_WELCOME_MESSAGE;
    default:
      return DESKTOP_WELCOME_MESSAGE;
  }
};

const normalizeTerminalWindowState = (
  position: WindowPosition,
  size: WindowSize,
  workspace: WindowSize,
  isCompactMobile: boolean,
) => {
  const minWidth = isCompactMobile ? Math.min(280, Math.max(220, workspace.width || 280)) : TERMINAL_MIN_WIDTH;
  const minHeight = isCompactMobile ? Math.min(220, Math.max(180, workspace.height || 220)) : TERMINAL_MIN_HEIGHT;
  const maxWidth = Math.max(minWidth, workspace.width || minWidth);
  const maxHeight = Math.max(minHeight, workspace.height || minHeight);
  const width = clampValue(size.width, minWidth, maxWidth);
  const height = clampValue(size.height, minHeight, maxHeight);
  const maxX = Math.max(0, workspace.width - width);
  const maxY = Math.max(0, workspace.height - height);

  return {
    position: {
      x: clampValue(position.x, 0, maxX),
      y: clampValue(position.y, 0, maxY),
    },
    size: { width, height },
  };
};

const getResponsiveTerminalSize = (
  workspace: WindowSize,
  isCompactMobile: boolean,
  preferredSize?: WindowSize,
): WindowSize => {
  if (isCompactMobile) {
    return {
      width: Math.max(0, workspace.width),
      height: Math.round(clampValue(workspace.height * 0.84, 260, Math.min(440, workspace.height))),
    };
  }

  if (preferredSize) {
    return normalizeTerminalWindowState({ x: 0, y: 0 }, preferredSize, workspace, false).size;
  }

  const maxWidth = Math.max(TERMINAL_MIN_WIDTH, workspace.width);
  const maxHeight = Math.max(TERMINAL_MIN_HEIGHT, workspace.height);

  return {
    width: Math.round(clampValue(workspace.width * 0.5, TERMINAL_MIN_WIDTH, Math.min(680, maxWidth))),
    height: Math.round(clampValue(workspace.height * 0.72, TERMINAL_MIN_HEIGHT, Math.min(640, maxHeight))),
  };
};

const getDefaultTerminalOffset = () => ({
  x: 0,
  y: 0,
});

const getInitialLines = (welcomeMessage: string, showInitialHelp: boolean): TerminalLine[] => {
  const nextLines: TerminalLine[] = [{ id: 0, type: 'output', content: welcomeMessage }];

  if (showInitialHelp) {
    nextLines.push({
      id: 1,
      type: 'info',
      content: "Hint: type 'help' to reveal a few extra commands.",
    });
  }

  return nextLines;
};

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(({
  themeId = 'cmd',
  workspaceSize,
  preferredSize,
  isMinimized: controlledIsMinimized,
  onMinimizedChange,
  onFocus,
  zIndex = 10,
  isCompactMobile = false,
  showInitialHelp = true,
  showCompactCloseButton = false,
  welcomeVariant = 'desktop',
  onClose,
  onReboot,
  onPlay,
}, ref) => {
  const welcomeMessage = getWelcomeMessage(welcomeVariant);
  const effectiveWorkspace = workspaceSize ?? getFallbackWorkspaceSize();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(2);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const getThemeConfig = useCallback((id: string) => {
    switch (id) {
      case 'matrix':
        return {
          bg: '#000500',
          text: '#00FF41',
          prompt: 'neo@matrix:~$',
          header: 'Matrix Core',
          welcome: `Wake up, Neo...\n\nHello, World! I'm Manushri Muruga Kumar\nASU CS graduate building software.`,
          caret: '#00FF41',
        };
      case 'ubuntu':
        return {
          bg: '#300a24',
          text: '#ffffff',
          prompt: 'manu@ubuntu:~$',
          header: 'Terminal (Ubuntu)',
          welcome: welcomeMessage,
          caret: '#ffffff',
        };
      case 'dracula':
        return {
          bg: '#282a36',
          text: '#f8f8f2',
          prompt: 'dracula$',
          header: 'Dracula Terminal',
          welcome: welcomeMessage,
          caret: '#bd93f9',
        };
      case 'cmd':
        return {
          bg: 'var(--xp-terminal-bg)',
          text: 'var(--xp-terminal-text)',
          prompt: welcomeVariant === 'mobile' ? 'C:\\Visitor>' : 'C:\\Users\\Visitor>',
          header: 'C:\\WINDOWS\\system32\\cmd.exe',
          welcome: welcomeMessage,
          caret: 'var(--xp-terminal-text)',
        };
      default:
        return {
          bg: 'var(--xp-terminal-bg)',
          text: 'var(--xp-terminal-text)',
          prompt: 'C:\\Users\\Visitor>',
          header: 'Windows PowerShell',
          welcome: welcomeMessage,
          caret: 'var(--xp-terminal-text)',
        };
    }
  }, [welcomeMessage, welcomeVariant]);

  const theme = getThemeConfig(themeId);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [internalIsMinimized, setInternalIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(() => getDefaultTerminalOffset());
  const [size, setSize] = useState(() => getResponsiveTerminalSize(effectiveWorkspace, isCompactMobile, preferredSize));
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasManualPosition, setHasManualPosition] = useState(false);
  const [hasManualResize, setHasManualResize] = useState(false);
  const isMinimized = controlledIsMinimized ?? internalIsMinimized;
  const fillsWorkspaceWidth = isCompactMobile || Math.abs(size.width - effectiveWorkspace.width) <= 1;

  const setMinimizedState = useCallback((value: boolean) => {
    if (controlledIsMinimized === undefined) {
      setInternalIsMinimized(value);
    }
    onMinimizedChange?.(value);
  }, [controlledIsMinimized, onMinimizedChange]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const resetTerminalSession = useCallback(() => {
    const nextLines = getInitialLines(theme.welcome, showInitialHelp);
    setLines(nextLines);
    lineIdRef.current = nextLines.length;
    setCurrentInput('');
    setCommandHistory([]);
    setHistoryIndex(-1);
    setIsMaximized(false);
    setHasManualPosition(false);
    setHasManualResize(false);
    setPosition(getDefaultTerminalOffset());
    setSize(getResponsiveTerminalSize(effectiveWorkspace, isCompactMobile, preferredSize));
    setMinimizedState(false);
  }, [effectiveWorkspace, isCompactMobile, preferredSize, setMinimizedState, showInitialHelp, theme.welcome]);

  useEffect(() => {
    const nextLines = getInitialLines(theme.welcome, showInitialHelp);
    setLines(nextLines);
    lineIdRef.current = nextLines.length;
  }, [showInitialHelp, theme.welcome]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [scrollToBottom]);

  const executeCommand = useCallback((input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    const newLines: TerminalLine[] = [
      {
        id: lineIdRef.current++,
        type: 'input',
        content: input,
      },
    ];

    if (trimmedInput === '') {
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);

    if (trimmedInput === 'cls' || trimmedInput === 'clear') {
      setLines([]);
      return;
    }

    if (trimmedInput === 'reboot') {
      newLines.push({
        id: lineIdRef.current++,
        type: 'success',
        content: 'Rebooting MANU OS and restoring the default desktop layout...',
      });
      setLines((prev) => [...prev, ...newLines]);
      window.setTimeout(() => {
        onReboot?.();
        resetTerminalSession();
      }, 120);
      return;
    }

    if (trimmedInput === 'play') {
      newLines.push({
        id: lineIdRef.current++,
        type: 'success',
        content: 'Launching Snake.exe...',
      });
      setLines((prev) => [...prev, ...newLines]);
      onPlay?.();
      return;
    }

    switch (trimmedInput) {
      case 'help':
        newLines.push({ id: lineIdRef.current++, type: 'info', content: HELP_MESSAGE });
        break;
      case 'whoami':
        newLines.push({
          id: lineIdRef.current++,
          type: 'output',
          content: 'Manushri Muruga Kumar // software engineer, builder, and occasional filmmaker',
        });
        break;
      case 'about-os':
        newLines.push({ id: lineIdRef.current++, type: 'output', content: ABOUT_OS_MESSAGE });
        break;
      case 'tech':
        newLines.push({ id: lineIdRef.current++, type: 'output', content: TECH_MESSAGE });
        break;
      case 'credits':
        newLines.push({ id: lineIdRef.current++, type: 'output', content: CREDITS_MESSAGE });
        break;
      case 'cat':
        newLines.push({ id: lineIdRef.current++, type: 'success', content: CAT_MESSAGE });
        break;
      case 'fortune':
        newLines.push({
          id: lineIdRef.current++,
          type: 'output',
          content: FORTUNE_MESSAGES[Math.floor(Math.random() * FORTUNE_MESSAGES.length)] ?? FORTUNE_MESSAGES[0],
        });
        break;
      default:
        newLines.push({
          id: lineIdRef.current++,
          type: 'error',
          content: `Command not found: ${trimmedInput}. Type 'help' for available commands.`,
        });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, [onPlay, onReboot, resetTerminalSession]);

  useImperativeHandle(ref, () => ({
    executeExternalCommand: (command: string) => {
      setMinimizedState(false);
      onFocus?.();
      executeCommand(command);
      window.setTimeout(focusInput, 100);
    },
  }), [executeCommand, focusInput, onFocus, setMinimizedState]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (isCompactMobile) return;
    if ((e.target as HTMLElement).closest('.terminal-header-buttons')) return;
    onFocus?.();
    setHasManualPosition(true);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleResizeDown = (e: ReactMouseEvent) => {
    if (isCompactMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setHasManualResize(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized && !isCompactMobile) {
        setPosition(
          normalizeTerminalWindowState(
            {
              x: e.clientX - dragStart.current.x,
              y: e.clientY - dragStart.current.y,
            },
            size,
            effectiveWorkspace,
            false,
          ).position,
        );
      }

      if (isResizing && !isMaximized && !isCompactMobile) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        const nextState = normalizeTerminalWindowState(
          position,
          {
            width: resizeStart.current.w + deltaX,
            height: resizeStart.current.h + deltaY,
          },
          effectiveWorkspace,
          false,
        );
        setPosition(nextState.position);
        setSize(nextState.size);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [effectiveWorkspace, isCompactMobile, isDragging, isMaximized, isResizing, position, size]);

  useEffect(() => {
    const nextAutoSize = getResponsiveTerminalSize(effectiveWorkspace, isCompactMobile, preferredSize);

    if (isCompactMobile || !hasManualResize) {
      setSize((prev) => (isSameWindowSize(prev, nextAutoSize) ? prev : nextAutoSize));
      return;
    }

    setSize((prev) => {
      const nextSize = normalizeTerminalWindowState(position, prev, effectiveWorkspace, false).size;
      return isSameWindowSize(prev, nextSize) ? prev : nextSize;
    });
  }, [effectiveWorkspace, hasManualResize, isCompactMobile, position, preferredSize]);

  useEffect(() => {
    if (isCompactMobile || !hasManualPosition) {
      const defaultPosition = getDefaultTerminalOffset();
      setPosition((prev) => (isSameWindowPosition(prev, defaultPosition) ? prev : defaultPosition));
      return;
    }

    setPosition((prev) => {
      const nextPosition = normalizeTerminalWindowState(prev, size, effectiveWorkspace, false).position;
      return isSameWindowPosition(prev, nextPosition) ? prev : nextPosition;
    });
  }, [effectiveWorkspace, hasManualPosition, isCompactMobile, size]);

  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = AUTO_COMPLETE_COMMANDS.filter((command) => command.startsWith(currentInput.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }, [commandHistory, currentInput, executeCommand, historyIndex]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'error':
        return 'text-terminal-red';
      case 'success':
        return 'text-terminal-green';
      case 'info':
        return 'text-terminal-cyan';
      default:
        return 'text-foreground';
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      style={{
        transform: isMaximized ? 'none' : isCompactMobile ? 'translateX(-46%)' : `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: isMaximized ? '100%' : isCompactMobile ? `${size.width}px` : fillsWorkspaceWidth ? '100%' : `${size.width}px`,    
        height: isMaximized ? '100%' : `${size.height}px`,
        position: isMaximized ? 'fixed' : 'relative',  
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : isCompactMobile ? '50%' : 'auto', marginTop: isCompactMobile ? '20px' : undefined,
        zIndex: isMaximized ? zIndex + 1: zIndex,
        boxSizing: 'border-box',
        maxWidth: '100%',
        maxHeight: '100%',
        willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
        backgroundColor: 'var(--xp-window)',
        border: '5px solid var(--xp-window-border)',
        boxShadow: '0 18px 45px var(--xp-window-shadow)',
      }}
      className={`relative pointer-events-auto flex flex-col overflow-hidden shadow-2xl ${
        isMaximized || isCompactMobile ? '' : isDragging || isResizing ? '' : 'transition-all duration-200'
      } ${isDragging ? 'select-none' : ''}`}
      onMouseDownCapture={onFocus}
      onClick={(e) => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;

        onFocus?.();
        focusInput();
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center justify-between gap-3 ${isCompactMobile ? 'cursor-default px-3 py-1' : 'cursor-move px-4 py-1'} select-none text-white`}
        style={{
          background: 'linear-gradient(90deg, var(--xp-blue) 0%, var(--xp-blue-light) 100%)',
          borderBottom: '2px solid #163d9d',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white [text-shadow:1px_1px_0_rgba(0,0,0,0.45)]">
            {theme.header}
          </span>
        </div>

        <div className="terminal-header-buttons flex items-center gap-0.5">
          {isCompactMobile ? (
            showCompactCloseButton ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimizedState(true);
                }}
                className="flex h-6 w-7 items-center justify-center text-black transition-colors"
                style={{
                  backgroundColor: 'var(--xp-window)',
                  border: '1px solid #8f8b78',
                }}
              >
                <X size={14} />
              </button>
            ) : null
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimizedState(true);
                }}
                className="flex h-6 w-7 items-center justify-center text-black transition-colors"
                style={{
                  backgroundColor: 'var(--xp-window)',
                  border: '1px solid #8f8b78',
                }}
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMaximized(!isMaximized);
                }}
                className="flex h-6 w-7 items-center justify-center text-black transition-colors"
                style={{
                  backgroundColor: 'var(--xp-window)',
                  border: '1px solid #ffffff',
                }}
              >
                {isMaximized ? <Copy size={14} className="rotate-180" /> : <Square size={14} />}
              </button>
              {onClose ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex h-6 w-7 items-center justify-center text-white transition-colors"
                  style={{
                    background: 'linear-gradient(180deg, #f9b27d 0%, #ef7b3d 45%, #cf4d19 100%)',
                    border: '1px solid #8f2204',
                  }}
                  aria-label="Close terminal window"
                >
                  <X size={14} />
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div
        ref={terminalRef}
        style={{ backgroundColor: theme.bg, color: theme.text }}
        className={`terminal-scrollbar min-h-0 flex-1 overflow-y-auto font-mono leading-relaxed ${isCompactMobile ? 'p-3 text-[12px]' : 'p-3 text-[13px] md:p-4 md:text-sm'}`}
      >
        <div ref={contentRef}>
          {lines.map((line) => (
            <div key={line.id} className={`${line.type === 'input' ? '' : getLineColor(line.type)} whitespace-pre-wrap`}>
              {line.type === 'input' ? (
                <div className="flex">
                  <span style={{ color: theme.text }}>{theme.prompt}</span>
                  <span className="ml-2" style={{ color: theme.text }}>{line.content}</span>
                </div>
              ) : (
                <div className="animate-fade-in">{line.content}</div>
              )}
            </div>
          ))}

          <div className="flex items-center">
            <span style={{ color: theme.text }}>{theme.prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ color: theme.text, caretColor: theme.caret }}
              className="ml-2 flex-1 bg-transparent outline-none"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {!isMaximized && !isCompactMobile && (
        <div
          onMouseDown={handleResizeDown}
          className="absolute bottom-0 right-0 cursor-nwse-resize p-1"
          style={{ color: '#6a6a6a' }}
        >
          <div className="h-3 w-3 border-b-2 border-r-2 border-[#7d7d7d]" />
        </div>
      )}
    </div>
  );
});
