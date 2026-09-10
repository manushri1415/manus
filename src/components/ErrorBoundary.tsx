import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level crash guard. Without this, an uncaught render error anywhere in
 * the app (most likely the large, stateful Index.tsx desktop shell) blanks
 * the whole page with React's default white screen. This renders a themed
 * "blue screen of death" fallback instead, in keeping with the Mindows 2005
 * bit, with a way back to the desktop.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in app tree:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.href = import.meta.env.BASE_URL || "/";
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--xp-blue-dark, #1b47b8)",
          color: "#fff",
          fontFamily: "'JetBrains Mono', 'Consolas', monospace",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <p style={{ fontSize: 14, margin: "0 0 16px" }}>Mindows 2005</p>
          <p style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px" }}>
            A fatal exception has occurred at 0x00005TR3AK.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 16px", opacity: 0.9 }}>
            The application has crashed to protect the rest of the desktop. You can
            press the button below to restart, or reload the page.
          </p>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              margin: "0 0 24px",
              opacity: 0.7,
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              background: "#fff",
              color: "var(--xp-blue-dark, #1b47b8)",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Restart Mindows 2005
          </button>
        </div>
      </div>
    );
  }
}
