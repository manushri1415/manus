import { useState, useRef, useEffect } from 'react';
import { User, Trash2, File } from 'lucide-react';

interface DesktopIconProps {
    icon: any;
    label: string;
    command: string;
    onDoubleClick: (command: string) => void;
    initialPos: { x: number; y: number };
    iconSrc?: string;
}

const DesktopIcon = ({ icon: Icon, label, command, onDoubleClick, initialPos, iconSrc }: DesktopIconProps) => {
    const [pos, setPos] = useState(initialPos);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
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
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                position: 'absolute',
                zIndex: isDragging ? 20 : 10,
            }}
            className={`flex flex-col items-center w-16 p-1.5 cursor-pointer select-none group rounded-md hover:bg-white/10 transition-colors ${isDragging ? 'opacity-70' : ''}`}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-lg border border-blue-400/30 group-hover:bg-blue-500/30 group-hover:border-blue-400/50 backdrop-blur-sm transition-all shadow-lg">
                {iconSrc ? (
                    <img src={iconSrc} alt={label} className="w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                ) : (
                    <Icon className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                )}
            </div>
            <span className="mt-1 text-[10px] font-medium text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 py-0.5 rounded leading-tight">
                {label}
            </span>
        </div>
    );
};

export const DesktopIcons = ({ onIconClick }: { onIconClick: (command: string) => void }) => {
    const projectsIconSrc = `${import.meta.env.BASE_URL}assets/icons/projects.png`;
    const experienceIconSrc = `${import.meta.env.BASE_URL}assets/icons/experience.png`;
    const phoneIconSrc = `${import.meta.env.BASE_URL}assets/icons/phone.png`;
    const profileIconSrc = `${import.meta.env.BASE_URL}assets/icons/profile.png`;
    const resumeIconSrc = `${import.meta.env.BASE_URL}assets/icons/resume-logo.png`;
    const icons = [
        { icon: null, label: 'My Story', command: 'about', pos: { x: 20, y: 10 ,},iconSrc: profileIconSrc },
        { icon: null, label: 'Projects', command: 'projects', pos: { x: 20, y: 110 }, iconSrc: projectsIconSrc },
        { icon: null, label: 'Experience', command: 'experience', pos: { x: 20, y: 210 }, iconSrc: experienceIconSrc },
        { icon: null, label: 'Resume', command: 'resume', pos: { x: 20, y: 310 },iconSrc: resumeIconSrc },
        { icon: null, label: 'Contact', command: 'contact', pos: { x: 20, y: 400 }, iconSrc: phoneIconSrc },
    ];

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                {icons.map((icon, idx) => (
                    <DesktopIcon
                        key={idx}
                        icon={icon.icon}
                        label={icon.label}
                        command={icon.command}
                        onDoubleClick={onIconClick}
                        initialPos={icon.pos}
                        iconSrc={icon.iconSrc}
                    />
                ))}
            </div>
        </div>
    );
};
