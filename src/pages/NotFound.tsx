import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{
        background: "var(--xp-blue-dark, #1b47b8)",
        color: "#fff",
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      }}
    >
      <div className="max-w-xl text-center">
        <p className="mb-4 text-sm opacity-80">Mindows 2005</p>
        <p className="mb-4 text-2xl font-bold">
          404: The requested page could not be located.
        </p>
        <p className="mb-2 text-sm leading-relaxed opacity-90">
          <code className="rounded bg-black/25 px-1.5 py-0.5">{location.pathname}</code>{" "}
          doesn't exist on this desktop.
        </p>
        <p className="mb-8 text-sm leading-relaxed opacity-70">
          It may have been moved, deleted, or never installed in the first place.
        </p>
        {/* Router-relative Link, not a raw <a href="/"> — this survives the
            /manus/ base path the site deploys under on GitHub Pages. */}
        <Link
          to="/"
          className="inline-block rounded px-5 py-2.5 text-sm font-bold text-[var(--xp-blue-dark,#1b47b8)]"
          style={{ background: "#fff" }}
        >
          Return to Desktop
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
