import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by CMS ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-level-2 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0f172a]">
                Unexpected Workspace Error
              </h2>
              <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                An unexpected condition interrupted the CMS runtime. We have captured the event safely.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-left overflow-x-auto text-[11px] font-mono text-[#b91c1c]">
                {this.state.error.message}
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={this.handleReload}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full"
            >
              Reload Workspace
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}