import React from 'react';

/**
 * ErrorBoundary — Catches render errors anywhere in the React tree
 * to prevent white-screen crashes and offer seamless recovery.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('KisanSathi Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F4F5F3',
            padding: '24px',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            color: '#0E2A12',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(24px, 5vw, 44px)',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 16px 40px rgba(14, 42, 18, 0.08)',
              border: '1px solid rgba(14, 42, 18, 0.08)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '20px',
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#0E2A12',
                margin: '0 0 10px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Something went wrong
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#5C6E5F',
                lineHeight: 1.6,
                margin: '0 0 24px 0',
              }}
            >
              An unexpected error occurred while rendering this view. Your agricultural inputs and farm data are safe. Please reload the application or return home.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#2E6B34',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(46, 107, 52, 0.2)',
                }}
              >
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  borderRadius: '999px',
                  border: '1px solid rgba(14, 42, 18, 0.15)',
                  backgroundColor: '#FFFFFF',
                  color: '#0E2A12',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Return to Home
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details
                style={{
                  marginTop: '24px',
                  textAlign: 'left',
                  backgroundColor: '#F9FAF8',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#DC2626',
                  overflowX: 'auto',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error Details</summary>
                <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
