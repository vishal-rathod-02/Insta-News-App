import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-oled-black p-4 font-sans selection:bg-violet-500/30">
          <div className="relative group max-w-2xl w-full">
            {/* Glow behind the card */}
            <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-4xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

            {/* Gradient border wrapper */}
            <div className="relative p-px rounded-3xl bg-linear-to-b from-violet-200 to-fuchsia-100 dark:from-violet-500/50 dark:to-fuchsia-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(139,92,246,0.1)] transition-all duration-300">
              <div className="relative flex flex-col items-center justify-center p-10 sm:p-16 bg-white dark:bg-oled-surface rounded-[calc(1.5rem-1px)] text-center overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 p-5 bg-violet-50 dark:bg-violet-500/10 rounded-full mb-8">
                  <AlertTriangle className="w-12 h-12 text-violet-600 dark:text-violet-400" />
                </div>

                <h1 className="relative z-10 text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                  Oops! Something went wrong.
                </h1>

                <p className="relative z-10 text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
                  We're sorry, but the application encountered an unexpected
                  error. Please try reloading the page.
                </p>

                <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={this.handleReload}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 transition-all active:scale-95"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reload Page
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-oled-border hover:bg-slate-50 dark:hover:bg-[#2A1D40] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 font-bold rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    <Home className="w-5 h-5" />
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
