import { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Square, X, Copy, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface BrowserWindowProps {
  title: string;
  url: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onClose: () => void;
  windowKey?: string;
}

const getStorageKey = (key: string) => `window-state-${key}`;

export const BrowserWindow = ({
  title,
  url,
  children,
  initialPosition,
  initialSize,
  onClose,
  windowKey,
}: BrowserWindowProps) => {
  const getInitialState = () => {
    if (!windowKey) return { position: initialPosition, size: initialSize };
    const saved = localStorage.getItem(getStorageKey(windowKey));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { position: initialPosition, size: initialSize };
      }
    }
    return { position: initialPosition, size: initialSize };
  };

  const initialState = getInitialState();
  const [position, setPosition] = useState(initialState.position);
  const [size, setSize] = useState(initialState.size);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.browser-header-buttons')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
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
      h: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      }
      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setSize({
          width: Math.max(400, resizeStart.current.w + deltaX),
          height: Math.max(300, resizeStart.current.h + deltaY),
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

  useEffect(() => {
    if (windowKey) {
      localStorage.setItem(getStorageKey(windowKey), JSON.stringify({ position, size }));
    }
  }, [position, size, windowKey]);

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-[40px] right-4 bg-secondary border border-border rounded-t-lg px-4 py-2 cursor-pointer shadow-lg animate-fade-in flex items-center gap-2 z-[60]"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
        <span className="text-xs font-mono">{title}</span>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      style={{
        transform: isMaximized ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : `${size.height}px`,
        position: isMaximized ? 'fixed' : 'relative',
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : 'auto',
        zIndex: isMaximized ? 40 : 20,
        willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
      }}
      className={`bg-white border border-gray-300 rounded-lg overflow-hidden shadow-2xl flex flex-col ${
        isMaximized ? '' : isDragging || isResizing ? '' : 'transition-all duration-200'
      } ${isDragging ? 'select-none' : ''}`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-move select-none"
      >
        <span className="text-xs font-semibold">{title}</span>

        <div className="flex items-center gap-0.5 browser-header-buttons">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="p-0.5 hover:bg-white/20 transition-colors rounded"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className="p-0.5 hover:bg-white/20 transition-colors rounded"
          >
            {isMaximized ? <Copy size={14} className="rotate-180" /> : <Square size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-0.5 hover:bg-red-500 transition-colors rounded"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 border-b border-blue-300">
        <button className="p-0.5 hover:bg-blue-200 rounded transition-colors">
          <ArrowLeft size={13} className="text-blue-600" />
        </button>
        <button className="p-0.5 hover:bg-blue-200 rounded transition-colors">
          <ArrowRight size={13} className="text-blue-600" />
        </button>
        <button className="p-0.5 hover:bg-blue-200 rounded transition-colors">
          <RotateCw size={13} className="text-blue-600" />
        </button>
        <div className="flex-1 bg-white border border-blue-300 rounded px-2 py-0.5">
          <span className="text-xs text-gray-600 font-mono">{url}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-400/20 transition-colors"
        >
          <div className="w-full h-full border-r-2 border-b-2 border-gray-300" />
        </div>
      )}
    </div>
  );
};
