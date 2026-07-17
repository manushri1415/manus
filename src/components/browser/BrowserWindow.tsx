import { useState, useRef, useEffect } from 'react';
import {
  Minus,
  Square,
  X,
  Copy,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ChevronDown,
} from 'lucide-react';

const MIN_WINDOW_WIDTH = 400;
const MIN_WINDOW_HEIGHT = 300;
const XP_WINDOW_BORDER = '#80a5e7';
const XP_WINDOW_INNER_BORDER = '#b9d0f6';
const XP_WINDOW_FRAME = '#ece9d8';
const XP_TITLE_BAR = 'linear-gradient(180deg, #9dc0f2 0%, #8cb2eb 10%, #80a5e7 30%, #7398de 62%, #678bd3 100%)';
const XP_TOOLBAR_BG = 'linear-gradient(180deg, #f8f6ee 0%, #ece8da 52%, #ddd6c4 100%)';
const XP_BUTTON_BG = 'linear-gradient(180deg, #fefefe 0%, #eef5ff 45%, #c7daf7 100%)';
const XP_CLOSE_BG = 'linear-gradient(180deg, #f9b27d 0%, #ef7b3d 45%, #cf4d19 100%)';
const XP_MENU_BG = 'linear-gradient(180deg, #faf8f1 0%, #f0ebde 100%)';

const menuItems = ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'];

type WindowPosition = { x: number; y: number };
type WindowSize = { width: number; height: number };

interface BrowserWindowProps {
  title: string;
  url: string;
  children: React.ReactNode;
  initialPosition: WindowPosition;
  initialSize: WindowSize;
  workspaceSize: WindowSize;
  minSize?: Partial<WindowSize>;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimizedChange?: (v: boolean) => void;
  onFocus?: () => void;
  zIndex?: number;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onRefresh?: () => void;
}

const clampValue = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

const normalizeWindowState = (
  position: WindowPosition,
  size: WindowSize,
  workspaceSize: WindowSize,
  minSize?: Partial<WindowSize>
) => {
  const minWidth = Math.max(MIN_WINDOW_WIDTH, minSize?.width ?? MIN_WINDOW_WIDTH);
  const minHeight = Math.max(MIN_WINDOW_HEIGHT, minSize?.height ?? MIN_WINDOW_HEIGHT);
  const maxWidth = Math.max(minWidth, workspaceSize.width || minWidth);
  const maxHeight = Math.max(minHeight, workspaceSize.height || minHeight);
  const width = clampValue(size.width, minWidth, maxWidth);
  const height = clampValue(size.height, minHeight, maxHeight);
  const maxX = Math.max(0, workspaceSize.width - width);
  const maxY = Math.max(0, workspaceSize.height - height);

  return {
    position: {
      x: clampValue(position.x, 0, maxX),
      y: clampValue(position.y, 0, maxY),
    },
    size: { width, height },
  };
};

export const BrowserWindow = ({
  title,
  url,
  children,
  initialPosition,
  initialSize,
  workspaceSize,
  minSize,
  onClose,
  isMinimized = false,
  onMinimizedChange,
  onFocus,
  zIndex = 20,
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  onRefresh,
}: BrowserWindowProps) => {
  const initialState = normalizeWindowState(initialPosition, initialSize, workspaceSize, minSize);
  const [position, setPosition] = useState(initialState.position);
  const [size, setSize] = useState(initialState.size);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const appliedInitialState = useRef('');

  useEffect(() => {
    if (isMaximized) return;

    const initialStateKey = [
      initialPosition.x,
      initialPosition.y,
      initialSize.width,
      initialSize.height,
      workspaceSize.width,
      workspaceSize.height,
      minSize?.width ?? '',
      minSize?.height ?? '',
    ].join(':');

    if (appliedInitialState.current === initialStateKey) return;
    appliedInitialState.current = initialStateKey;

    const nextState = normalizeWindowState(initialPosition, initialSize, workspaceSize, minSize);
    setPosition(nextState.position);
    setSize(nextState.size);
  }, [
    initialPosition.x,
    initialPosition.y,
    initialSize.width,
    initialSize.height,
    workspaceSize.width,
    workspaceSize.height,
    minSize?.width,
    minSize?.height,
    isMaximized,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.browser-header-buttons')) return;
    setIsDragging(true);
    onFocus?.();
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
        setPosition(
          normalizeWindowState(
            {
              x: e.clientX - dragStart.current.x,
              y: e.clientY - dragStart.current.y,
            },
            size,
            workspaceSize,
            minSize
          ).position
        );
      }
      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        const nextState = normalizeWindowState(
          position,
          {
            width: resizeStart.current.w + deltaX,
            height: resizeStart.current.h + deltaY,
          },
          workspaceSize,
          minSize
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
  }, [isDragging, isResizing, isMaximized, minSize, position, size, workspaceSize]);

  useEffect(() => {
    if (isMaximized) return;

    const nextState = normalizeWindowState(position, size, workspaceSize, minSize);
    if (
      nextState.position.x !== position.x ||
      nextState.position.y !== position.y ||
      nextState.size.width !== size.width ||
      nextState.size.height !== size.height
    ) {
      setPosition(nextState.position);
      setSize(nextState.size);
    }
  }, [isMaximized, minSize, position, size, workspaceSize]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      style={{
        transform: isMaximized ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : `${size.height}px`,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: isMaximized ? zIndex + 1 : zIndex,
        willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
        backgroundColor: XP_WINDOW_FRAME,
        borderTop: `1px solid ${XP_WINDOW_BORDER}`,
        borderLeft: `3px solid ${XP_WINDOW_BORDER}`,
        borderRight: `3px solid ${XP_WINDOW_BORDER}`,
        borderBottom: `3px solid ${XP_WINDOW_BORDER}`,
        borderRadius: '8px',
        boxShadow: `inset 1px 0 0 ${XP_WINDOW_INNER_BORDER}, inset -1px 0 0 ${XP_WINDOW_INNER_BORDER}, inset 0 -1px 0 ${XP_WINDOW_INNER_BORDER}, 0 0 0 2px rgba(255,255,255,0.22) inset, 0 18px 45px rgba(0, 0, 0, 0.38)`,
      }}
      className={`pointer-events-auto overflow-hidden flex flex-col ${
        isMaximized ? '' : isDragging || isResizing ? '' : 'transition-all duration-200'
      } ${isDragging ? 'select-none' : ''}`}
      onMouseDownCapture={onFocus}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between cursor-move select-none"
        style={{
          minHeight: '30px',
          padding: '4px 6px 5px 8px',
          color: '#ffffff',
          background: XP_TITLE_BAR,
          borderBottom: '1px solid #08318d',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72), inset 1px 0 0 rgba(255,255,255,0.35), inset -1px 0 0 rgba(255,255,255,0.18)',
        }}
      >
        <span
          className="truncate text-[13px] font-bold"
          style={{
            fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
            letterSpacing: '0.1px',
            textShadow: '1px 1px 0 rgba(0, 0, 70, 0.55)',
          }}
        >
          {title}
        </span>

        <div className="flex items-center gap-1 browser-header-buttons">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimizedChange?.(true);
            }}
            className="flex h-[20px] w-[22px] items-center justify-center rounded-[3px] transition-transform active:translate-y-px"
            style={{
              background: XP_BUTTON_BG,
              border: '1px solid #365da8',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(60,104,173,0.45)',
            }}
          >
            <Minus size={13} color="#11327d" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className="flex h-[20px] w-[22px] items-center justify-center rounded-[3px] transition-transform active:translate-y-px"
            style={{
              background: XP_BUTTON_BG,
              border: '1px solid #365da8',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(60,104,173,0.45)',
            }}
          >
            {isMaximized ? (
              <Copy size={12} className="rotate-180" color="#11327d" strokeWidth={2.1} />
            ) : (
              <Square size={12} color="#11327d" strokeWidth={2.1} />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-[20px] w-[22px] items-center justify-center rounded-[3px] transition-transform active:translate-y-px"
            style={{
              background: XP_CLOSE_BG,
              border: '1px solid #8f2204',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 0 rgba(132,34,8,0.42)',
            }}
          >
            <X size={13} color="#ffffff" strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div
        className="flex items-center gap-4 px-3 py-1"
        style={{
          background: XP_MENU_BG,
          borderTop: '1px solid rgba(255,255,255,0.55)',
          borderBottom: '1px solid #c8c1af',
          fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className="text-[11px] text-[#4f4b42] transition-colors hover:text-[#163a8e]"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Address Bar */}
      <div
        className="flex items-center gap-1.5 px-2 py-1"
        style={{
          background: XP_MENU_BG,
          borderTop: '1px solid rgba(255,255,255,0.7)',
          borderBottom: '1px solid #c2baa9',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBack?.();
          }}
          disabled={!canGoBack}
          className="flex h-[22px] w-[24px] items-center justify-center rounded-[3px] disabled:cursor-default disabled:opacity-45"
          style={{
            background: XP_BUTTON_BG,
            border: '1px solid #8ea3c0',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <ArrowLeft size={13} className="text-[#215dc6]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onForward?.();
          }}
          disabled={!canGoForward}
          className="flex h-[22px] w-[24px] items-center justify-center rounded-[3px] disabled:cursor-default disabled:opacity-45"
          style={{
            background: XP_BUTTON_BG,
            border: '1px solid #8ea3c0',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <ArrowRight size={13} className="text-[#215dc6]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRefresh?.();
          }}
          disabled={!onRefresh}
          className="flex h-[22px] w-[24px] items-center justify-center rounded-[3px] disabled:cursor-default disabled:opacity-45"
          style={{
            background: XP_BUTTON_BG,
            border: '1px solid #8ea3c0',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <RotateCw size={13} className="text-[#215dc6]" />
        </button>
        <span
          className="text-[11px] text-[#4f4b42]"
          style={{ fontFamily: 'Tahoma, "Trebuchet MS", sans-serif' }}
        >
          Address
        </span>
        <div
          className="flex-1 rounded-[3px] px-2 py-0.5"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #7f9db9',
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <span
            className="text-xs text-[#555555]"
            style={{ fontFamily: 'Tahoma, "Trebuchet MS", sans-serif' }}
          >
            {url}
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-[3px] px-2 py-1 text-[11px] text-[#3a4559]"
          style={{
            background: XP_BUTTON_BG,
            border: '1px solid #8ea3c0',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
            fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
          }}
        >
          <span>Go</span>
          <ChevronDown size={12} className="text-[#215dc6]" />
        </button>
      </div>

      {/* Links Bar */}
      <div
        className="flex items-center gap-4 px-3 py-1"
        style={{
          background: XP_TOOLBAR_BG,
          borderTop: '1px solid rgba(255,255,255,0.55)',
          borderBottom: '1px solid #b8b09d',
          fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
        }}
      >
        <span className="text-[11px] font-bold text-[#4f4b42]">Links</span>
        <span className="text-[11px] text-[#215dc6]">MSN.com</span>
        <span className="text-[11px] text-[#215dc6]">Windows Media</span>
        <span className="text-[11px] text-[#215dc6]">Hotmail</span>
        <span className="text-[11px] text-[#215dc6]">Favorites</span>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 min-h-0 overflow-auto"
        style={{ backgroundColor: '#ffffff' }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeDown}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
          style={{ backgroundColor: XP_WINDOW_FRAME }}
        >
          <div
            className="h-full w-full"
            style={{
              borderRight: '2px solid #8b8679',
              borderBottom: '2px solid #8b8679',
            }}
          />
        </div>
      )}
    </div>
  );
};
