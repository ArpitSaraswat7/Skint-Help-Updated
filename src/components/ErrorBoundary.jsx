import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log to error reporting service in production
        if (import.meta.env.PROD) {
            // TODO: Send to Sentry or other error tracking service
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="glass-card p-8 rounded-2xl max-w-lg w-full text-center">
                        <div className="mb-6">
                            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-muted-foreground">
                                We're sorry for the inconvenience. The error has been logged and we'll look into it.
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                                <p className="text-sm font-mono text-red-400 mb-2">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="text-xs text-muted-foreground">
                                        <summary className="cursor-pointer hover:text-foreground">
                                            Stack trace
                                        </summary>
                                        <pre className="mt-2 overflow-auto max-h-40">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={this.handleReset}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Go to Home
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="border-white/20"
                            >
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
