import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught clinical UI error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800 border-2 border-rose-500 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-500 mx-auto flex items-center justify-center font-bold">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">System Recovery Active</h2>
            <p className="text-xs text-slate-300">
              A temporary interface error was caught by the AayuCare clinical safety boundary. Your medical records remain intact.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 mx-auto shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Safe Session</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
