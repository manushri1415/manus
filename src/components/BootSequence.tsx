import { useEffect, useState } from 'react';

const BOOT_DURATION_MS = 3000;
const EXIT_TRANSITION_MS = 420;

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
    const [isExiting, setIsExiting] = useState(false);
    const startupImageSrc = `${import.meta.env.BASE_URL}assets/icons/windows-start.png`;

    useEffect(() => {
        const exitTimeoutId = window.setTimeout(() => {
            setIsExiting(true);
        }, BOOT_DURATION_MS - EXIT_TRANSITION_MS);

        const completeTimeoutId = window.setTimeout(onComplete, BOOT_DURATION_MS);

        return () => {
            window.clearTimeout(exitTimeoutId);
            window.clearTimeout(completeTimeoutId);
        };
    }, [onComplete]);

    return (
        <>
            <style>{`
                @keyframes boot-screen-enter {
                    0% {
                        opacity: 0;
                        transform: scale(1.012);
                        filter: brightness(0.45);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                        filter: brightness(1);
                    }
                }

                @keyframes boot-logo-breathe {
                    0%,
                    100% {
                        filter: brightness(0.98);
                    }
                    50% {
                        filter: brightness(1.05);
                    }
                }

                @keyframes boot-bar-scan {
                    0% {
                        transform: translateX(-130%);
                    }
                    100% {
                        transform: translateX(240%);
                    }
                }

                @keyframes boot-bar-shimmer {
                    0%,
                    100% {
                        opacity: 0.72;
                    }
                    50% {
                        opacity: 1;
                    }
                }
            `}</style>

            <div
                className="fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity ease-out"
                style={{
                    opacity: isExiting ? 0 : 1,
                    transitionDuration: `${EXIT_TRANSITION_MS}ms`,
                }}
            >
                <div
                    className="relative flex h-full w-full items-center justify-center"
                    style={{
                        animation: 'boot-screen-enter 420ms ease-out forwards',
                    }}
                >
                    <img
                        src={startupImageSrc}
                        alt="Windows 2005 startup screen"
                        className="h-full w-full select-none object-contain"
                        draggable={false}
                        style={{
                            animation: 'boot-logo-breathe 2.2s ease-in-out infinite',
                        }}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(0,0,0,0.28)_100%)]" />

                    <div className="pointer-events-none absolute left-1/2 top-[61.5%] h-[18px] w-[min(42vw,280px)] min-w-[170px] -translate-x-1/2 overflow-hidden rounded-[4px] border border-[#2f2f2f] bg-[linear-gradient(180deg,#080808_0%,#171717_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.12)] sm:h-[20px] sm:min-w-[210px]">
                        <div className="absolute inset-[2px] overflow-hidden rounded-[2px] bg-[linear-gradient(180deg,#060606_0%,#141414_100%)]">
                            <div className="absolute inset-y-0 left-0 right-0 opacity-80 [background-image:linear-gradient(90deg,rgba(255,255,255,0.06)_0_2px,transparent_2px_32px)]" />
                            <div
                                className="absolute inset-y-0 w-[34%] rounded-[2px] bg-[linear-gradient(90deg,#2d5000_0%,#88d11c_28%,#ddff61_50%,#88d11c_72%,#2d5000_100%)] shadow-[0_0_14px_rgba(154,255,62,0.5)]"
                                style={{
                                    animation: 'boot-bar-scan 1.08s linear infinite, boot-bar-shimmer 0.85s ease-in-out infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
