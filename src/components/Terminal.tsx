import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Minus, Square, Copy } from 'lucide-react';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string | React.ReactNode;
}

type WindowSize = {
  width: number;
  height: number;
};

const WELCOME_MESSAGE = `Hello, World! I'm Manushri
ASU CS graduate | full-stack, backend, and AI-integrated apps.
Type 'help' to see available commands.`;

const ABOUT_MESSAGE = `
+-----------------------------------------------------------+
| ABOUT                                                     |
| Chennai, India -> Arizona | ASU CS graduate               |
| Full-stack, backend, and product-focused engineer         |
| Building useful, human-centered software with a           |
| storyteller's eye.                                        |
+-----------------------------------------------------------+
`;

const SKILLS_MESSAGE = `
+-----------------------------------------------------------+
| SKILLS                                                    |
| Languages  TypeScript | JavaScript | Python | Java | SQL |
| Frameworks React | Flask | Next.js | ASP.NET | Supabase  |
| Tools      Git | Docker | Vercel | PostgreSQL | MySQL    |
| Focus      Full-stack | backend | AI-integrated products |
+-----------------------------------------------------------+
`;

const PROJECTS_MESSAGE = `
+-----------------------------------------------------------+
| PROJECTS                                                  |
| Collegiate  AI-powered college/career planning platform   |
| Evexia      Healthcare data transparency hackathon app    |
| Censend     AI extension for safer professional emails    |
| SceneStack  Film production coordination platform         |
| More details live in the Projects window.                 |
+-----------------------------------------------------------+
`;

const CONTACT_MESSAGE = `
+-----------------------------------------------------------+
| CONTACT                                                   |
| Email     manushrimkumar@gmail.com                        |
| LinkedIn  linkedin.com/in/manushrimurugakumar             |
| GitHub    github.com/manushri1415                         |
| Resume    type 'resume'                                   |
+-----------------------------------------------------------+
`;

const COMMANDS: Record<string, { description: string; action: () => string | React.ReactNode }> = {
  help: {
    description: 'Show available commands',
    action: () => `
Available commands:
  help      - Show this help message
  about     - Learn about me
  experience - Open my experience page
  skills    - View my technical skills
  projects  - Browse my projects
  contact   - Get my contact information
  resume    - Open my resume
  whoami    - Display current user
  date      - Show current date and time
  clear     - Clear the terminal
`,
  },
  about: {
    description: 'Learn about me',
    action: () => ABOUT_MESSAGE,
  },
  skills: {
    description: 'View my technical skills',
    action: () => SKILLS_MESSAGE,
  },
  projects: {
    description: 'Browse my projects',
    action: () => PROJECTS_MESSAGE,
  },
  contact: {
    description: 'Get my contact information',
    action: () => CONTACT_MESSAGE,
  },
  whoami: {
    description: 'Display current user',
    action: () => 'manushri@portfolio',
  },
  date: {
    description: 'Show current date and time',
    action: () => new Date().toLocaleString(),
  },
  clear: {
    description: 'Clear the terminal',
    action: () => 'CLEAR',
  },
};

type TerminalProps = {
  themeId?: string;
  onOpenExperience?: () => void;
  onOpenResume?: () => void;
  workspaceSize?: WindowSize;
  isMinimized?: boolean;
  onMinimizedChange?: (value: boolean) => void;
  onFocus?: () => void;
  zIndex?: number;
};

const EXTRA_COMMANDS = ['experience', 'resume'];

const TERMINAL_MIN_WIDTH = 420;
const TERMINAL_MIN_HEIGHT = 380;

const clampValue = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

const getFallbackWorkspaceSize = (): WindowSize => {
  if (typeof window === 'undefined') {
    return { width: 1200, height: 700 };
  }

  return {
    width: Math.max(0, window.innerWidth - 32),
    height: Math.max(0, window.innerHeight - 72),
  };
};

const getResponsiveTerminalSize = (workspace: WindowSize): WindowSize => {
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

export const Terminal = forwardRef(({ themeId = 'cmd', onOpenExperience, onOpenResume, workspaceSize, isMinimized: controlledIsMinimized, onMinimizedChange, onFocus, zIndex = 10 }: TerminalProps, ref) => {
  const getThemeConfig = (id: string) => {
    switch (id) {
      case 'matrix':
        return {
          bg: '#000500',
          text: '#00FF41',
          prompt: 'neo@matrix:~$',
          header: 'Matrix Core',
          welcome: `Wake up, Neo...\n\nHello, World! I'm Manushri Muruga Kumar\nASU CS graduate building software.`,
          caret: '#00FF41'
        };
      case 'ubuntu':
        return {
          bg: '#300a24',
          text: '#ffffff',
          prompt: 'Manu@ubuntu:~$',
          header: 'Terminal (Ubuntu)',
          welcome: WELCOME_MESSAGE,
          caret: '#ffffff'
        };
      case 'dracula':
        return {
          bg: '#282a36',
          text: '#f8f8f2',
          prompt: 'Î»',
          header: 'Dracula Terminal',
          welcome: WELCOME_MESSAGE,
          caret: '#bd93f9'
        };
      case 'cmd':
        return {
          bg: 'var(--xp-terminal-bg)',
          text: 'var(--xp-terminal-text)',
          prompt: 'C:\\Users\\Manu>',
          header: 'C:\\WINDOWS\\system32\\cmd.exe',
          welcome: WELCOME_MESSAGE,
          caret: 'var(--xp-terminal-text)'
        };
      default:
        return {
          bg: 'var(--xp-terminal-bg)',
          text: 'var(--xp-terminal-text)',
          prompt: 'PS C:\\Users\\Manu>',
          header: 'Windows PowerShell',
          welcome: WELCOME_MESSAGE,
          caret: 'var(--xp-terminal-text)'
        };
    }
  };

  const theme = getThemeConfig(themeId);
  const resumePdfPath = `${import.meta.env.BASE_URL}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;

  const [lines, setLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    setLines([{ id: 0, type: 'output', content: theme.welcome }]);
  }, [themeId]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [internalIsMinimized, setInternalIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(() => getDefaultTerminalOffset());
  const [size, setSize] = useState(() => getResponsiveTerminalSize(workspaceSize ?? getFallbackWorkspaceSize()));
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasManualPosition, setHasManualPosition] = useState(false);
  const [hasManualResize, setHasManualResize] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const effectiveWorkspace = workspaceSize ?? getFallbackWorkspaceSize();
  const isMinimized = controlledIsMinimized ?? internalIsMinimized;

  const setMinimizedState = useCallback((value: boolean) => {
    if (controlledIsMinimized === undefined) {
      setInternalIsMinimized(value);
    }
    onMinimizedChange?.(value);
  }, [controlledIsMinimized, onMinimizedChange]);

  useImperativeHandle(ref, () => ({
    executeExternalCommand: (command: string) => {
      setMinimizedState(false);
      onFocus?.();
      executeCommand(command);
      setTimeout(focusInput, 100);
    }
  }), [onFocus, setMinimizedState]);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(1);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.terminal-header-buttons')) return;
    onFocus?.();
    setHasManualPosition(true);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setHasManualResize(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        });
      }
      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setSize({
          width: clampValue(
            resizeStart.current.w + deltaX,
            TERMINAL_MIN_WIDTH,
            Math.max(TERMINAL_MIN_WIDTH, effectiveWorkspace.width)
          ),
          height: clampValue(
            resizeStart.current.h + deltaY,
            TERMINAL_MIN_HEIGHT,
            Math.max(TERMINAL_MIN_HEIGHT, effectiveWorkspace.height)
          )
        });
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
  }, [effectiveWorkspace.height, effectiveWorkspace.width, isDragging, isResizing, isMaximized]);

  useEffect(() => {
    const nextAutoSize = getResponsiveTerminalSize(effectiveWorkspace);

    if (!hasManualResize) {
      setSize(nextAutoSize);
      return;
    }

    setSize((prev) => ({
      width: clampValue(prev.width, TERMINAL_MIN_WIDTH, Math.max(TERMINAL_MIN_WIDTH, effectiveWorkspace.width)),
      height: clampValue(prev.height, TERMINAL_MIN_HEIGHT, Math.max(TERMINAL_MIN_HEIGHT, effectiveWorkspace.height)),
    }));
  }, [effectiveWorkspace, hasManualResize]);

  useEffect(() => {
    if (hasManualPosition) return;
    setPosition(getDefaultTerminalOffset());
  }, [effectiveWorkspace, hasManualPosition]);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Handle auto-scroll when content size changes (like images loading)
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

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    const newLines: TerminalLine[] = [];

    // Add the input line
    newLines.push({
      id: lineIdRef.current++,
      type: 'input',
      content: input,
    });

    if (trimmedInput === '') {
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    // Add to command history
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);

    // Handle clear command specially
    if (trimmedInput === 'cls' || trimmedInput === 'clear') {
      setLines([]);
      return;
    }

    if (trimmedInput === 'experience') {
      onOpenExperience?.();
      newLines.push({
        id: lineIdRef.current++,
        type: 'success',
        content: 'Opening experience page...',
      });
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (trimmedInput === 'resume') {
      onOpenResume?.();
      newLines.push({
        id: lineIdRef.current++,
        type: 'success',
        content: (
          <span>
            Opening resume viewer...{' '}
            <a
              href={resumePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-terminal-cyan"
            >
              Open PDF in a new tab
            </a>
          </span>
        ),
      });
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    // Execute command
    const command = COMMANDS[trimmedInput];
    if (command) {
      const result = command.action();
      newLines.push({
        id: lineIdRef.current++,
        type: 'output',
        content: result,
      });
    } else {
      newLines.push({
        id: lineIdRef.current++,
        type: 'error',
        content: `Command not found: ${trimmedInput}. Type 'help' for available commands.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        executeCommand(currentInput);
        setCurrentInput('');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        } else {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Auto-complete
        const matches = [...Object.keys(COMMANDS), ...EXTRA_COMMANDS].filter((cmd) =>
          cmd.startsWith(currentInput.toLowerCase())
        );
        if (matches.length === 1) {
          setCurrentInput(matches[0]);
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      }
    },
    [currentInput, commandHistory, historyIndex, executeCommand]
  );

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

  if (isMinimized) return null;

  return (
    <div
      style={{
        transform: isMaximized ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : `${size.height}px`,
        position: isMaximized ? 'fixed' : 'relative',
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : 'auto',
        zIndex: isMaximized ? zIndex + 1 : zIndex,
        maxWidth: '100%',
        maxHeight: '100%',
        willChange: (isDragging || isResizing) ? 'transform, width, height' : 'auto',
        backgroundColor: 'var(--xp-window)',
        border: '5px solid var(--xp-window-border)',
        boxShadow: '0 18px 45px var(--xp-window-shadow)',
      }}
      className={`relative pointer-events-auto overflow-hidden shadow-2xl flex flex-col ${isMaximized ? '' : (isDragging || isResizing ? '' : 'transition-all duration-200')} ${isDragging ? 'select-none' : ''}`}
      onMouseDownCapture={onFocus}
      onClick={(e) => {
        // Only focus if the user isn't selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;

        // Prevent focusing if we clicked a button or interactive element
        if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;

        onFocus?.();
        focusInput();
      }}
    >
      {/* Terminal Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between gap-3 px-4 py-1 cursor-move select-none text-white"
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

        <div className="flex items-center gap-0.5 terminal-header-buttons">
          <button
            onClick={(e) => { e.stopPropagation(); setMinimizedState(true); }}
            className="flex h-6 w-7 items-center justify-center text-black transition-colors"
            style={{
              backgroundColor: 'var(--xp-window)',
              border: '1px solid #8f8b78',
            }}
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="flex h-6 w-7 items-center justify-center text-black transition-colors"
            style={{
              backgroundColor: 'var(--xp-window)',
              border: '1px solid #8f8b78',
            }}
          >
            {isMaximized ? <Copy size={14} className="rotate-180" /> : <Square size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        style={{ backgroundColor: theme.bg, color: theme.text }}
        className="flex-1 overflow-y-auto p-3 md:p-4 font-mono text-[13px] md:text-sm leading-relaxed terminal-scrollbar min-h-0"
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

          {/* Current Input Line */}
          <div className="flex items-center">
            <span style={{ color: theme.text }}>{theme.prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ color: theme.text, caretColor: theme.caret }}
              className="flex-1 ml-2 bg-transparent outline-none"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div
        className="hidden flex-wrap items-center justify-between gap-2 px-3 py-2 md:px-4 text-[11px] md:text-xs select-none"
        style={{
          backgroundColor: 'var(--xp-window)',
          borderTop: '1px solid var(--xp-window-border)',
          color: '#5b5b5b',
        }}
      >
        <span>Type 'help' for commands</span>
        <div className="flex items-center gap-3">
          <span>â†‘â†“ History â€¢ Tab Autocomplete</span>
          {!isMaximized && (
            <div
              onMouseDown={handleResizeDown}
              className="cursor-nwse-resize p-1 transition-colors"
              style={{ color: '#6a6a6a' }}
            >
              <div className="w-3 h-3 border-r-2 border-b-2 border-[#7d7d7d]" />
            </div>
          )}
        </div>
      </div>
      {!isMaximized && (
        <div
          onMouseDown={handleResizeDown}
          className="absolute bottom-0 right-0 cursor-nwse-resize p-1"
          style={{ color: '#6a6a6a' }}
        >
          <div className="w-3 h-3 border-r-2 border-b-2 border-[#7d7d7d]" />
        </div>
      )}
    </div>
  );
});
