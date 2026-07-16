import { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Square, X, Copy, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

const MIN_WINDOW_WIDTH = 400;
const MIN_WINDOW_HEIGHT = 300;

type WindowPosition = { x: number; y: number };
type WindowSize = { width: number; height: number };

interface BrowserWindowProps {
  title: string;
  url: string;
  children: React.ReactNode;
  initialPosition: WindowPosition;
  initialSize: WindowSize;
  workspaceSize: WindowSize;
  contentBaseSize?: WindowSize;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimizedChange?: (v: boolean) => void;
  onFocus?: () => void;
  zIndex?: number;
}

const clampValue = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

const normalizeWindowState = (
  position: WindowPosition,
  size: WindowSize,
  workspaceSize: WindowSize
) => {
  const maxWidth = Math.max(MIN_WINDOW_WIDTH, workspaceSize.width || MIN_WINDOW_WIDTH);
  const maxHeight = Math.max(MIN_WINDOW_HEIGHT, workspaceSize.height || MIN_WINDOW_HEIGHT);
  const width = clampValue(size.width, MIN_WINDOW_WIDTH, maxWidth);
  const height = clampValue(size.height, MIN_WINDOW_HEIGHT, maxHeight);
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
  contentBaseSize,
  onClose,
  isMinimized = false,
  onMinimizedChange,
  onFocus,
  zIndex = 20,
}: BrowserWindowProps) => {
  const initialState = normalizeWindowState(initialPosition, initialSize, workspaceSize);
  const [position, setPosition] = useState(initialState.position);
  const [size, setSize] = useState(initialState.size);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const contentViewportRef = useRef<HTMLDivElement>(null);
  const appliedInitialState = useRef('');
  const [contentViewportSize, setContentViewportSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!contentBaseSize) return;

    const viewport = contentViewportRef.current;
    if (!viewport) return;

    const updateViewportSize = () => {
      setContentViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    };

    updateViewportSize();

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentBaseSize, isMaximized, size.height, size.width]);

  useEffect(() => {
    if (isMaximized) return;

    const initialStateKey = [
      initialPosition.x,
      initialPosition.y,
      initialSize.width,
      initialSize.height,
      workspaceSize.width,
      workspaceSize.height,
    ].join(':');

    if (appliedInitialState.current === initialStateKey) return;
    appliedInitialState.current = initialStateKey;

    const nextState = normalizeWindowState(initialPosition, initialSize, workspaceSize);
    setPosition(nextState.position);
    setSize(nextState.size);
  }, [
    initialPosition.x,
    initialPosition.y,
    initialSize.width,
    initialSize.height,
    workspaceSize.width,
    workspaceSize.height,
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
            workspaceSize
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
          workspaceSize
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
  }, [isDragging, isResizing, isMaximized, position, size, workspaceSize]);

  useEffect(() => {
    if (isMaximized) return;

    const nextState = normalizeWindowState(position, size, workspaceSize);
    if (
      nextState.position.x !== position.x ||
      nextState.position.y !== position.y ||
      nextState.size.width !== size.width ||
      nextState.size.height !== size.height
    ) {
      setPosition(nextState.position);
      setSize(nextState.size);
    }
  }, [isMaximized, position, size, workspaceSize]);

  if (isMinimized) {
    return null;
  }

  const contentScale = contentBaseSize && contentViewportSize.width
    ? Math.min(contentViewportSize.width / contentBaseSize.width, 1)
    : 1;

  const scaledContentWidth = contentBaseSize
    ? Math.round(contentBaseSize.width * contentScale)
    : undefined;
  const scaledContentHeight = contentBaseSize
    ? Math.round(contentBaseSize.height * contentScale)
    : undefined;

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
      }}
      className={`pointer-events-auto bg-white border border-gray-300 rounded-lg overflow-hidden shadow-2xl flex flex-col ${
        isMaximized ? '' : isDragging || isResizing ? '' : 'transition-all duration-200'
      } ${isDragging ? 'select-none' : ''}`}
      onMouseDownCapture={onFocus}
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
              onMinimizedChange?.(true);
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
      <div
        ref={contentViewportRef}
        className={`flex-1 bg-white ${contentBaseSize ? 'overflow-y-auto overflow-x-hidden' : 'overflow-y-auto'}`}
      >
        {contentBaseSize ? (
          <div className="min-h-full w-full overflow-hidden bg-white">
            <div
              className="mx-auto"
              style={{
                width: `${scaledContentWidth ?? contentBaseSize.width}px`,
                height: `${scaledContentHeight ?? contentBaseSize.height}px`,
                minHeight: '100%',
              }}
            >
              <div
                style={{
                  width: `${contentBaseSize.width}px`,
                  height: `${contentBaseSize.height}px`,
                  transform: `scale(${contentScale})`,
                  transformOrigin: 'top left',
                }}
              >
                {children}
              </div>
            </div>
          </div>
        ) : (
          children
        )}
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
