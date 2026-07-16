import {
  BriefcaseBusiness,
  FileText,
  FolderOpen,
  Github,
  LinkedinIcon,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import type { BrowserPageKey } from './browser/pages/registry';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/manushri1415',
    label: 'GitHub',
  },
  {
    icon: Mail,
    href: 'mailto:manushrimkumar@gmail.com',
    label: 'Email',
  },
  {
    icon: LinkedinIcon,
    href: 'https://linkedin.com/in/manushrimurugakumar',
    label: 'LinkedIn',
  },
];

export const SocialLinks = ({
  onReset,
  onLogout,
  onOpenPage,
  onPowerOff,
}: {
  onReset?: () => void;
  onLogout?: () => void;
  onOpenPage?: (pageKey: BrowserPageKey) => void;
  onPowerOff?: () => void;
}) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const startLogoSrc = `${import.meta.env.BASE_URL}assets/icons/start-logo.png`;
  const profileIconSrc = `${import.meta.env.BASE_URL}assets/icons/profile.png`;
  const projectsIconSrc = `${import.meta.env.BASE_URL}assets/icons/projects.png`;
  const experienceIconSrc = `${import.meta.env.BASE_URL}assets/icons/experience.png`;
  const phoneIconSrc = `${import.meta.env.BASE_URL}assets/icons/phone.png`;
  const resumeIconSrc = `${import.meta.env.BASE_URL}assets/icons/resume-logo.png`;
  const logOutIconSrc = `${import.meta.env.BASE_URL}assets/icons/log-out.png`;
  const powerOffIconSrc = `${import.meta.env.BASE_URL}assets/icons/turn-off.png`;
  const resumePdfPath = `${import.meta.env.BASE_URL}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;

  const quickLinks: Array<{
    label: string;
    pageKey: BrowserPageKey;
    icon?: typeof UserRound;
    iconSrc?: string;
  }> = [
    {
      label: 'My Story',
      pageKey: 'about',
      iconSrc: profileIconSrc,
    },
    {
      label: 'Projects',
      pageKey: 'projects',
      iconSrc: projectsIconSrc,
    },
    {
      label: 'Experience',
      pageKey: 'experience',
      iconSrc: experienceIconSrc,
    },
  ];

  const systemLinks: Array<{
    label: string;
    pageKey?: BrowserPageKey;
    href?: string;
    icon?: typeof FolderOpen;
    iconSrc?: string;
  }> = [
    { label: 'About Me', pageKey: 'about', icon: UserRound },
    { label: 'Projects', pageKey: 'projects', icon: FolderOpen },
    { label: 'Experience', pageKey: 'experience', icon: BriefcaseBusiness },
    { label: 'Contact', pageKey: 'contact', icon: Phone },
    { label: 'Resume', href: resumePdfPath, iconSrc: resumeIconSrc },
  ];

  const handleOpenPage = (pageKey: BrowserPageKey) => {
    onOpenPage?.(pageKey);
    setIsStartOpen(false);
  };

  const handleAction = (action?: () => void) => {
    action?.();
    setIsStartOpen(false);
  };

  return (
    <div className="flex items-center h-full">
      {/* Left Side: Start Button & Start Menu */}
      <div className="flex items-center h-full">
        <div className="relative">
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`flex h-full min-w-[84px] items-center gap-1.5 rounded-r-[10px] border border-[#2f7d2d] px-2.5 pr-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(0,0,0,0.25)] transition-all ${
              isStartOpen
                ? 'bg-[linear-gradient(180deg,#6edb6f_0%,#40a93f_40%,#2e882d_100%)] brightness-95'
                : 'bg-[linear-gradient(180deg,#72de73_0%,#40a93f_42%,#2f8c30_100%)] hover:brightness-105'
            }`}
          >
            <img src={startLogoSrc} alt="Start" className="h-8 w-8 object-contain" />
            <span className="text-[17px] font-bold italic leading-none [text-shadow:1px_1px_1px_rgba(0,0,0,0.45)]">
              Start
            </span>
          </button>

          {/* Start Menu Popup */}
          {isStartOpen && (
            <div className="absolute bottom-[32px] left-0 w-[310px] overflow-hidden rounded-t-[8px] border border-[#08319a] bg-[#245ada] shadow-[2px_0_18px_rgba(0,0,0,0.55)] animate-in slide-in-from-bottom-2 duration-200">
              <div className="border-b border-[#88b5ff] bg-[linear-gradient(180deg,#4f94ff_0%,#245ada_58%,#173b99_100%)] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-white/60 bg-[linear-gradient(180deg,#fefefe_0%,#dce7ff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),1px_1px_0_rgba(0,0,0,0.15)]">
                    <img src={profileIconSrc} alt="Profile" className="h-8 w-8 object-contain" />
                  </div>
                  <div>
                    <div className="text-[18px] font-bold text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.45)]">
                      Manushri
                    </div>
                    <div className="text-[11px] text-white/90">Desktop</div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[250px] bg-[#245ada]">
                <div className="flex w-[50%] flex-col bg-[linear-gradient(180deg,#ffffff_0%,#fffdf5_100%)] px-2 py-2 text-[#204387]">
                  {quickLinks.map(({ label, pageKey, iconSrc }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleOpenPage(pageKey)}
                      className="flex items-center gap-3 rounded-[4px] px-3 py-[7px] text-left transition-colors hover:bg-[#dce9ff]"
                    >
                      <img src={iconSrc} alt="" className="h-7 w-7 flex-shrink-0 object-contain" />
                      <span className="truncate text-[12px] font-bold text-[#1e4ea8]">{label}</span>
                    </button>
                  ))}

                  <div className="mx-3 my-2 h-px bg-[linear-gradient(90deg,#ffffff_0%,#d5def0_20%,#d5def0_80%,#ffffff_100%)]" />

                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsStartOpen(false)}
                      className="flex items-center gap-3 rounded-[4px] px-3 py-[7px] transition-colors hover:bg-[#dce9ff]"
                    >
                      <Icon className="h-6 w-6 flex-shrink-0 text-[#245ada]" />
                      <span className="truncate text-[12px] font-bold text-[#1e4ea8]">{label}</span>
                    </a>
                  ))}
                </div>

                <div className="flex w-[50%] flex-col border-l border-[#9fbee6] bg-[#d3e5fb] px-2 py-2 text-[#17408b]">
                  {systemLinks.map(({ label, pageKey, href, icon: Icon, iconSrc }) => (
                    href ? (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsStartOpen(false)}
                        className="flex items-center gap-3 rounded-[4px] px-3 py-[8px] transition-colors hover:bg-white/45"
                      >
                        {iconSrc ? (
                          <img src={iconSrc} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
                        ) : (
                          Icon && <Icon className="h-4 w-4 flex-shrink-0 text-[#245ada]" />
                        )}
                        <span className="text-[12px] font-bold">
                          {label}
                        </span>
                      </a>
                    ) : (
                      <button
                        key={label}
                        type="button"
                        onClick={() => pageKey && handleOpenPage(pageKey)}
                        className="flex items-center gap-3 rounded-[4px] px-3 py-[8px] text-left transition-colors hover:bg-white/45"
                      >
                        {iconSrc ? (
                          <img src={iconSrc} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
                        ) : (
                          Icon && <Icon className="h-4 w-4 flex-shrink-0 text-[#245ada]" />
                        )}
                        <span className="text-[12px] font-bold">
                          {label}
                        </span>
                      </button>
                    )
                  ))}

                  <div className="mx-2 my-2 h-px bg-[#9fbee6]" />

                  <button
                    type="button"
                    onClick={() => handleAction(onReset)}
                    className="flex items-center gap-3 rounded-[4px] px-3 py-[8px] text-left transition-colors hover:bg-white/45"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0 text-[#245ada]" />
                    <span className="text-[12px] font-bold">
                      Reset Desktop
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 border-t border-[#7ea7f5] bg-[linear-gradient(180deg,#3f7fe0_0%,#245ada_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
                <button
                  type="button"
                  onClick={() => handleAction(onLogout)}
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-transparent px-0 py-0 text-[11px] font-bold text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.35)]"
                >
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[3px]]">
                    <img src={logOutIconSrc} alt="" className="h-4 w-4 object-contain" />
                  </span>
                  <span>Log Off</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(onPowerOff)}
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-transparent px-0 py-0 text-[11px] font-bold text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.35)]"
                >
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[3px]]">
                    <img src={powerOffIconSrc} alt="" className="h-4 w-4 object-contain" />
                  </span>
                  <span>Turn Off Computer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
