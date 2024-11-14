import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorComponent from "./ErrorComponent";
import * as Sentry from "@sentry/nextjs";

interface ErrorBoundryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundryProps) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, { extra: { errorInfo: errorInfo } });
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  setErrorState() {
    this.setState({ hasError: !this.state.hasError });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent setErrorState={this.setErrorState.bind(this)} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
