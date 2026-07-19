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

const BROWSER_MIN_WINDOW_WIDTH = 400;
const BROWSER_MIN_WINDOW_HEIGHT = 300;
const XP_WINDOW_BORDER = '#80a5e7';
const XP_WINDOW_INNER_BORDER = '#b9d0f6';
const XP_WINDOW_FRAME = '#ece9d8';
const XP_TITLE_BAR = 'linear-gradient(180deg, #9dc0f2 0%, #8cb2eb 10%, #80a5e7 30%, #7398de 62%, #678bd3 100%)';
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
  chromeMode?: 'browser' | 'utility';
  showMinimizeButton?: boolean;
  showMaximizeButton?: boolean;
  resizable?: boolean;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
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
  mobileFullScreen?: boolean;
}

const clampValue = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

const getCompactRestoredWindowState = (
  workspaceSize: WindowSize,
  minSize: Partial<WindowSize> | undefined,
  defaultMinWidth: number,
  defaultMinHeight: number,
  chromeMode: 'browser' | 'utility',
) => {
  const widthRatio = chromeMode === 'utility' ? 0.94 : 0.96;
  const heightRatio = chromeMode === 'utility' ? 0.84 : 0.9;
  const targetSize = {
    width: Math.round(workspaceSize.width * widthRatio),
    height: Math.round(workspaceSize.height * heightRatio),
  };
  const centeredPosition = {
    x: Math.round((workspaceSize.width - targetSize.width) / 2),
    y: Math.round((workspaceSize.height - targetSize.height) / 2),
  };

  return normalizeWindowState(
    centeredPosition,
    targetSize,
    workspaceSize,
    minSize,
    defaultMinWidth,
    defaultMinHeight,
  );
};

const normalizeWindowState = (
  position: WindowPosition,
  size: WindowSize,
  workspaceSize: WindowSize,
  minSize?: Partial<WindowSize>,
  defaultMinWidth = BROWSER_MIN_WINDOW_WIDTH,
  defaultMinHeight = BROWSER_MIN_WINDOW_HEIGHT,
) => {
  const preferredMinWidth = Math.max(defaultMinWidth, minSize?.width ?? defaultMinWidth);
  const preferredMinHeight = Math.max(defaultMinHeight, minSize?.height ?? defaultMinHeight);
  const minWidth = workspaceSize.width > 0 ? Math.min(preferredMinWidth, workspaceSize.width) : preferredMinWidth;
  const minHeight = workspaceSize.height > 0 ? Math.min(preferredMinHeight, workspaceSize.height) : preferredMinHeight;
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
  chromeMode = 'browser',
  showMinimizeButton = true,
  showMaximizeButton = true,
  resizable = true,
  bodyClassName,
  bodyStyle,
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
  mobileFullScreen = false,
}: BrowserWindowProps) => {
  const defaultMinWidth = chromeMode === 'utility' ? 240 : BROWSER_MIN_WINDOW_WIDTH;
  const defaultMinHeight = chromeMode === 'utility' ? 140 : BROWSER_MIN_WINDOW_HEIGHT;
  const initialX = initialPosition.x;
  const initialY = initialPosition.y;
  const initialWidth = initialSize.width;
  const initialHeight = initialSize.height;
  const workspaceWidth = workspaceSize.width;
  const workspaceHeight = workspaceSize.height;
  const minWidth = minSize?.width;
  const minHeight = minSize?.height;
  const initialState = normalizeWindowState(
    initialPosition,
    initialSize,
    workspaceSize,
    minSize,
    defaultMinWidth,
    defaultMinHeight,
  );
  const [position, setPosition] = useState(initialState.position);
  const [size, setSize] = useState(initialState.size);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isViewportFullscreen, setIsViewportFullscreen] = useState(mobileFullScreen);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const appliedInitialState = useRef('');
  const previousMobileFullScreen = useRef(mobileFullScreen);

  const fillsWorkspace = isViewportFullscreen || isMaximized;
  const isBrowserChrome = chromeMode === 'browser';
  const isCompactMobile = workspaceWidth <= 600;
  const mobileGap = 16;
  const initialStateKey = [
    initialX,
    initialY,
    initialWidth,
    initialHeight,
    workspaceWidth,
    workspaceHeight,
    minWidth ?? '',
    minHeight ?? '',
  ].join(':');

  useEffect(() => {
    if (mobileFullScreen && !previousMobileFullScreen.current) {
      setIsViewportFullscreen(true);
      setIsMaximized(false);
    } else if (!mobileFullScreen && previousMobileFullScreen.current) {
      setIsViewportFullscreen(false);
    }

    previousMobileFullScreen.current = mobileFullScreen;
  }, [mobileFullScreen]);

  useEffect(() => {
    if (fillsWorkspace) return;

    if (appliedInitialState.current === initialStateKey) return;
    appliedInitialState.current = initialStateKey;

    const nextState = normalizeWindowState(
      { x: initialX, y: initialY },
      { width: initialWidth, height: initialHeight },
      { width: workspaceWidth, height: workspaceHeight },
      minSize ? { width: minWidth, height: minHeight } : undefined,
      defaultMinWidth,
      defaultMinHeight,
    );
    setPosition(nextState.position);
    setSize(nextState.size);
  }, [
    defaultMinHeight,
    defaultMinWidth,
    fillsWorkspace,
    initialHeight,
    initialStateKey,
    initialWidth,
    initialX,
    initialY,
    minHeight,
    minSize,
    minWidth,
    workspaceHeight,
    workspaceWidth,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (fillsWorkspace) return;
    if ((e.target as HTMLElement).closest('.browser-header-buttons')) return;
    setIsDragging(true);
    onFocus?.();
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    if (fillsWorkspace || isCompactMobile || !resizable) return;
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
      if (isDragging && !fillsWorkspace) {
        setPosition(
          normalizeWindowState(
            {
              x: e.clientX - dragStart.current.x,
              y: e.clientY - dragStart.current.y,
            },
            size,
            workspaceSize,
            minSize,
            defaultMinWidth,
            defaultMinHeight,
          ).position,
        );
      }
      if (isResizing && !fillsWorkspace) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        const nextState = normalizeWindowState(
          position,
          {
            width: resizeStart.current.w + deltaX,
            height: resizeStart.current.h + deltaY,
          },
          workspaceSize,
          minSize,
          defaultMinWidth,
          defaultMinHeight,
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
  }, [
    defaultMinHeight,
    defaultMinWidth,
    fillsWorkspace,
    isDragging,
    isResizing,
    minSize,
    position,
    resizable,
    size,
    workspaceSize,
  ]);

  useEffect(() => {
    if (fillsWorkspace || isCompactMobile) return;

    const nextState = normalizeWindowState(position, size, workspaceSize, minSize, defaultMinWidth, defaultMinHeight);
    if (
      nextState.position.x !== position.x ||
      nextState.position.y !== position.y ||
      nextState.size.width !== size.width ||
      nextState.size.height !== size.height
    ) {
      setPosition(nextState.position);
      setSize(nextState.size);
    }
  }, [defaultMinHeight, defaultMinWidth, fillsWorkspace, minSize, position, size, workspaceSize]);

  const handleMaximizeToggle = () => {
    if (mobileFullScreen) {
      if (isViewportFullscreen) {
        const restoredState = getCompactRestoredWindowState(
          workspaceSize,
          minSize,
          defaultMinWidth,
          defaultMinHeight,
          chromeMode,
        );
        setPosition(restoredState.position);
        setSize(restoredState.size);
      }

      setIsViewportFullscreen((prev) => !prev);
      return;
    }

    setIsMaximized((prev) => !prev);
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      style={{
        transform: fillsWorkspace ? 'none' : isCompactMobile? `translate3d(${mobileGap}px, ${mobileGap}px, 0)`: `translate3d(${position.x}px, ${position.y}px, 0)`,
        width:  fillsWorkspace ? 'auto': isCompactMobile? `${size.width}px=` : `${size.width}px`,
        height: fillsWorkspace ? 'auto' : isCompactMobile ? 'calc(100% - 80px)' : `${size.height}px`,
        position: fillsWorkspace ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: fillsWorkspace ? 0 : 'auto',
        zIndex: zIndex,
        boxSizing: 'border-box',
        maxWidth: '100%',
        maxHeight: '100%',
        bottom: fillsWorkspace ? '34px' : 'auto',
        willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
        backgroundColor: XP_WINDOW_FRAME,
        borderTop: `1px solid ${XP_WINDOW_BORDER}`,
        borderLeft: `4px solid ${XP_WINDOW_BORDER}`,
        borderRight: `4px solid ${XP_WINDOW_BORDER}`,
        borderBottom: `4px solid ${XP_WINDOW_BORDER}`,
        borderRadius: fillsWorkspace ? '0' : '3px',
        boxShadow: `inset 1px 0 0 ${XP_WINDOW_INNER_BORDER}, inset -1px 0 0 ${XP_WINDOW_INNER_BORDER}, inset 0 -1px 0 ${XP_WINDOW_INNER_BORDER}, 0 0 0 2px rgba(255,255,255,0.22) inset, 0 18px 45px rgba(0, 0, 0, 0.38)`,
      }}
      className={`pointer-events-auto overflow-hidden flex flex-col ${
        fillsWorkspace ? '' : isDragging || isResizing ? '' : 'transition-all duration-200'
      } ${isDragging ? 'select-none' : ''}`}
      onMouseDownCapture={onFocus}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center justify-between ${fillsWorkspace ? 'cursor-default px-3 py-2' : 'cursor-move px-[7px] py-[3px]'} select-none`}
        style={{
          minHeight: fillsWorkspace ? '30px' : '24px',
          color: '#ffffff',
          background: XP_TITLE_BAR,
          borderBottom: '1px solid #08318d',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72), inset 1px 0 0 rgba(255,255,255,0.35), inset -1px 0 0 rgba(255,255,255,0.18)',
        }}
      >
        <span
          className={`${fillsWorkspace ? 'text-[13px]' : 'text-[12px]'} truncate font-bold`}
          style={{
            fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
            letterSpacing: '0.1px',
            textShadow: '1px 1px 0 rgba(0, 0, 70, 0.55)',
          }}
        >
          {title}
        </span>

        <div className="browser-header-buttons flex items-center gap-1">
          {showMinimizeButton && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimizedChange?.(true);
                }}
                className="flex h-[18px] w-[20px] items-center justify-center rounded-[2px] transition-transform active:translate-y-px"
                style={{
                  background: XP_BUTTON_BG,
                  border: '1px solid #365da8',
                  boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(60,104,173,0.45)',
                }}
              >
                <Minus size={11} color="#11327d" strokeWidth={2.2} />
              </button>
            </>
          )}
          {showMaximizeButton && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaximizeToggle();
                }}
                className="flex h-[18px] w-[20px] items-center justify-center rounded-[2px] transition-transform active:translate-y-px"
                style={{
                  background: XP_BUTTON_BG,
                  border: '1px solid #365da8',
                  boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(60,104,173,0.45)',
                }}
              >
                {fillsWorkspace ? (
                  <Copy size={10} className="rotate-180" color="#11327d" strokeWidth={2.1} />
                ) : (
                  <Square size={10} color="#11327d" strokeWidth={2.1} />
                )}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-[18px] w-[20px] items-center justify-center rounded-[2px] transition-transform active:translate-y-px"
            style={{
              background: XP_CLOSE_BG,
              border: '1px solid #8f2204',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 0 rgba(132,34,8,0.42)',
            }}
          >
            <X size={11} color="#ffffff" strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {isBrowserChrome && !fillsWorkspace && (
        <div
          className="flex items-center gap-4 px-3 py-[2px]"
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
              className="text-[10px] text-[#4f4b42] transition-colors hover:text-[#163a8e]"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {isBrowserChrome && (
        <div
          className={`flex items-center ${fillsWorkspace ? 'gap-1 px-2 py-1.5' : 'gap-1 px-2 py-[2px]'}`}
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
            className="flex h-[20px] w-[22px] items-center justify-center rounded-[2px] disabled:cursor-default disabled:opacity-45"
            style={{
              background: XP_BUTTON_BG,
              border: '1px solid #8ea3c0',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <ArrowLeft size={12} className="text-[#215dc6]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onForward?.();
            }}
            disabled={!canGoForward}
            className="flex h-[20px] w-[22px] items-center justify-center rounded-[2px] disabled:cursor-default disabled:opacity-45"
            style={{
              background: XP_BUTTON_BG,
              border: '1px solid #8ea3c0',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <ArrowRight size={12} className="text-[#215dc6]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh?.();
            }}
            disabled={!onRefresh}
            className="flex h-[20px] w-[22px] items-center justify-center rounded-[2px] disabled:cursor-default disabled:opacity-45"
            style={{
              background: XP_BUTTON_BG,
              border: '1px solid #8ea3c0',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <RotateCw size={12} className="text-[#215dc6]" />
          </button>
          {!mobileFullScreen && (
            <span
              className="text-[10px] text-[#4f4b42]"
              style={{ fontFamily: 'Tahoma, "Trebuchet MS", sans-serif' }}
            >
              Address
            </span>
          )}
          <div
            className="flex-1 min-w-0 overflow-hidden rounded-[2px] px-2 py-0"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #7f9db9',
              boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <span
              className={`${fillsWorkspace ? 'text-[11px]' : 'text-[10px]'} block truncate whitespace-nowrap text-[#555555]`}
              style={{ fontFamily: 'Tahoma, "Trebuchet MS", sans-serif' }}
            >
              {url}
            </span>
          </div>
          {!mobileFullScreen && (
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 rounded-[2px] px-1.5 py-0.5 text-[10px] text-[#3a4559]"
              style={{
                background: XP_BUTTON_BG,
                border: '1px solid #8ea3c0',
                boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
                fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
              }}
            >
              <span>Go</span>
              <ChevronDown size={10} className="text-[#215dc6]" />
            </button>
          )}
        </div>
      )}

      <div
        className={`flex-1 min-h-0 overflow-auto ${bodyClassName ?? ''}`}
        style={{ backgroundColor: '#ffffff', ...bodyStyle }}
      >
        {children}
      </div>

      {!fillsWorkspace && !isCompactMobile && resizable && (
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
