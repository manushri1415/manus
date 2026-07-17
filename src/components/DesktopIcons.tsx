import { useState, useRef, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
    icon?: LucideIcon | null;
    label: string;
    command: string;
    onDoubleClick: (command: string) => void;
    initialPos: { x: number; y: number };
    iconSrc?: string;
    isMobile?: boolean;
}

const DesktopIcon = ({
    icon: Icon,
    label,
    command,
    onDoubleClick,
    initialPos,
    iconSrc,
    isMobile = false,
}: DesktopIconProps) => {
    const [pos, setPos] = useState(initialPos);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return;
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        };
    };

    const handleClick = () => {
        if (!isDragging) {
            onDoubleClick(command);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPos({
                    x: e.clientX - dragStart.current.x,
                    y: e.clientY - dragStart.current.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            style={{
                transform: isMobile ? 'none' : `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                position: isMobile ? 'relative' : 'absolute',
                zIndex: isDragging ? 20 : 10,
            }}
            className={`flex flex-col items-center ${
                isMobile ? 'min-w-[72px] px-2 py-1.5' : 'w-16 p-1.5'
            } cursor-pointer select-none group rounded-md hover:bg-white/10 transition-colors ${isDragging ? 'opacity-70' : ''}`}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <div className={`${isMobile ? 'h-12 w-12' : 'w-14 h-14'} flex items-center justify-center`}>
                {iconSrc ? (
                    <img
                        src={iconSrc}
                        alt={label}
                        className={`${isMobile ? 'h-10 w-10' : 'w-12 h-12'} object-contain drop-shadow-md`}
                    />
                ) : (
                    Icon ? <Icon className="w-12 h-12 text-white drop-shadow-md" /> : null
                )}
            </div>
            <span className={`mt-1 ${isMobile ? 'text-[11px]' : 'text-[10px]'} font-medium text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 py-0.5 rounded leading-tight`}>
                {label}
            </span>
        </div>
    );
};

export const DesktopIcons = ({
    onIconClick,
    isMobile = false,
    mobileColumns = 6,
}: {
    onIconClick: (command: string) => void;
    isMobile?: boolean;
    mobileColumns?: number;
}) => {
    const projectsIconSrc = `${import.meta.env.BASE_URL}assets/icons/projects.png`;
    const experienceIconSrc = `${import.meta.env.BASE_URL}assets/icons/experience.png`;
    const phoneIconSrc = `${import.meta.env.BASE_URL}assets/icons/phone.png`;
    const profileIconSrc = `${import.meta.env.BASE_URL}assets/icons/profile.png`;
    const resumeIconSrc = `${import.meta.env.BASE_URL}assets/icons/resume-logo.png`;
    const terminalIconSrc = `${import.meta.env.BASE_URL}assets/icons/terminal.png`;
    const icons = [
        { icon: null, label: 'My Story', command: 'about', pos: { x: 20, y: 10 ,},iconSrc: profileIconSrc },
        { icon: null, label: 'Projects', command: 'projects', pos: { x: 20, y: 110 }, iconSrc: projectsIconSrc },
        { icon: null, label: 'Experience', command: 'experience', pos: { x: 20, y: 210 }, iconSrc: experienceIconSrc },
        { icon: null, label: 'Resume', command: 'resume', pos: { x: 20, y: 310 },iconSrc: resumeIconSrc },
        { icon: null, label: 'Contact', command: 'contact', pos: { x: 20, y: 410 }, iconSrc: phoneIconSrc },
        { icon: null, label: 'Terminal', command: 'terminal', pos: { x: 20, y: 510 }, iconSrc: terminalIconSrc },
    ];

    return (
        <div className={`absolute z-0 pointer-events-none ${isMobile ? 'left-0 right-0 top-0 px-3 pt-3' : 'inset-0'}`}>
            <div
                className={`${isMobile ? 'grid gap-x-2 gap-y-2 rounded-xl bg-black/20 px-2 py-2 backdrop-blur-sm' : 'relative h-full w-full'} pointer-events-auto`}
                style={isMobile ? { gridTemplateColumns: `repeat(${mobileColumns}, minmax(0, 1fr))` } : undefined}
                onClick={(e) => e.stopPropagation()}
            >
                {icons.map((icon, idx) => (
                    <DesktopIcon
                        key={idx}
                        icon={icon.icon}
                        label={icon.label}
                        command={icon.command}
                        onDoubleClick={onIconClick}
                        initialPos={icon.pos}
                        iconSrc={icon.iconSrc}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </div>
    );
};
