import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Minus, Square, Copy } from 'lucide-react';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string | React.ReactNode;
}

const WELCOME_MESSAGE = `Hello, World! I'm Manushri
Get to know more about me using the Desktop icons to your left!
Type 'help' to see available commands.`;

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
    action: () => (
      <div className="my-4 space-y-4">
        <div className="border border-border rounded-lg overflow-hidden w-64 bg-secondary/50 shadow-lg">
          <img
            alt="Manushri Profile"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="font-mono leading-relaxed bg-secondary/30 p-4 border border-border rounded-lg">
          <div className="text-terminal-cyan font-bold mb-2">┌ ABOUT ME ┐</div>
          <p className="mb-4 text-foreground/90">
            I am a Computer Science graduate from Arizona State University interested in full-stack, backend, and product-focused software engineering
          </p>
          <p className="text-foreground/90">
            I am interested in software that helps real people communicate, organize information, and make better decisions
          </p>
          <div className="mt-4 text-muted-foreground text-xs italic">
            Currently working on exciting projects and always looking for new challenges.
          </div>
        </div>
      </div>
    ),
  },
  skills: {
    description: 'View my technical skills',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  TECHNICAL SKILLS                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Languages                                                  │
│  ─────────────────────────────────────────                  │
│  • TypeScript                                               │
│  • JavaScript                                               │
│  • Python                                                   │
│                                                             │
│  Frameworks & Libraries                                     │
│  ─────────────────────────────────────────                  │
│  • React                                                    │
│  • Node.js                                                  │
│  • Next.js                                                  │
│  • TailwindCSS                                              │
│                                                             │
│  Tools & Platforms                                          │
│  ─────────────────────────────────────────                  │
│  • Git, Docker, AWS, Vercel, PostgreSQL                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  projects: {
    description: 'Browse my projects',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  FEATURED PROJECTS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  01. syswaifu                                               │
│      ──────────────────────────────────                     │
│      A Cross-Platform Neofetch-style system info with       │
│      waifu images in terminal.                              │
│      → github.com/iamovi/syswaifu                           │
│                                                             │
│  02. button-will-react                                      │
│      ──────────────────────────────────                     │
│      A collection of playful pranks and interactive buttons.│
│      → github.com/iamovi/button-will-react                  │
│                                                             │
│  Visit https://iamovi.github.io/ blog site for              │
│  more amazing projects!                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  contact: {
    description: 'Get my contact information',
    action: () => `
┌─────────────────────────────────────────────────────────────┐
│  CONTACT                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📧 Email      manushrimkumar@gmail.com                     |    
│  🐙 GitHub     github.com/manushri1415                      │
│  🌐 Website    <update later>                               │
│                                                             
│  I'm always open to collaborating on interesting            │
│  projects or just chatting about code or anime!             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  },
  whoami: {
    description: 'Display current user',
    action: () => 'Manu@portfolio',
  },
  date: {
    description: 'Show current date and time',
    action: () => new Date('2005-02-15T09:19:00').toLocaleString(),
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
};

const EXTRA_COMMANDS = ['experience', 'resume'];

export const Terminal = forwardRef(({ themeId = 'powershell', onOpenExperience, onOpenResume }: TerminalProps, ref) => {
  const getThemeConfig = (id: string) => {
    switch (id) {
      case 'matrix':
        return {
          bg: '#000500',
          text: '#00FF41',
          prompt: 'neo@matrix:~$',
          header: 'Matrix Core',
          welcome: `Wake up, Neo...\n\nHello, World! I'm Manushri Muruga Kumar\n I am a software engineer`,
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
          prompt: 'λ',
          header: 'Dracula Terminal',
          welcome: WELCOME_MESSAGE,
          caret: '#bd93f9'
        };
      case 'cmd':
        return {
          bg: '#000000',
          text: '#ffffff',
          prompt: 'C:\\Users\\Manu>',
          header: 'Command Prompt',
          welcome: WELCOME_MESSAGE,
          caret: '#ffffff'
        };
      default:
        return {
          bg: '#012456',
          text: '#ffffff',
          prompt: 'PS C:\\Users\\Manu>',
          header: 'Windows PowerShell',
          welcome: WELCOME_MESSAGE,
          caret: '#ffffff'
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useImperativeHandle(ref, () => ({
    executeExternalCommand: (command: string) => {
      setIsMinimized(false);
      executeCommand(command);
      setTimeout(focusInput, 100);
    }
  }));

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(1);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.terminal-header-buttons')) return;
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
          width: Math.max(400, resizeStart.current.w + deltaX),
          height: Math.max(300, resizeStart.current.h + deltaY)
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
  }, [isDragging, isResizing, isMaximized]);

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

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-[40px] right-4 bg-secondary border border-border rounded-t-lg px-4 py-2 cursor-pointer shadow-lg animate-fade-in flex items-center gap-2 z-[60]"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
        <span className="text-xs font-mono">Terminal (Guest@Portfolio)</span>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: isMaximized ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : `${size.height}px`,
        position: isMaximized ? 'fixed' : 'relative',
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : 'auto',
        zIndex: isMaximized ? 50 : 10,
        willChange: (isDragging || isResizing) ? 'transform, width, height' : 'auto'
      }}
      className={`bg-card border border-border rounded-lg overflow-hidden shadow-2xl flex flex-col ${isMaximized ? '' : (isDragging || isResizing ? '' : 'transition-all duration-200')} ${isDragging ? 'select-none' : ''}`}
      onClick={(e) => {
        // Only focus if the user isn't selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;

        // Prevent focusing if we clicked a button or interactive element
        if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;

        focusInput();
      }}
    >
      {/* Terminal Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {theme.header}
          </span>
        </div>

        <div className="flex items-center terminal-header-buttons">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            {isMaximized ? <Copy size={14} className="rotate-180" /> : <Square size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        style={{ backgroundColor: theme.bg, color: theme.text }}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed terminal-scrollbar min-h-0"
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
      <div className="px-4 py-2 bg-secondary border-t border-border text-xs text-muted-foreground flex justify-between select-none">
        <span>Type 'help' for commands</span>
        <div className="flex items-center gap-4">
          <span>↑↓ History • Tab Autocomplete</span>
          {!isMaximized && (
            <div
              onMouseDown={handleResizeDown}
              className="cursor-nwse-resize p-1 hover:text-foreground transition-colors"
            >
              <div className="w-3 h-3 border-r-2 border-b-2 border-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
