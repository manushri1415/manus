export const ResumePage = () => {
  const basePath = import.meta.env.BASE_URL;
  const resumePdfPath = `${basePath}assets/icons/M-photos/Muruga_Kumar_Manu.pdf`;

  return (
    <div className="flex h-full min-h-full flex-col bg-[#f5f8ff] text-slate-900">
      <div className="border-b border-slate-300 bg-gradient-to-r from-[#fff9d6] via-white to-[#dbeafe] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-slate-500">
              Resume Viewer
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              Manushri Muruga Kumar
            </h1>
            <p className="text-sm text-slate-600">
              Software engineer resume, ready to preview or download.
            </p>
          </div>

          <a
            href={resumePdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Open PDF in new tab
          </a>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <iframe
            title="Manushri resume"
            src={resumePdfPath}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
