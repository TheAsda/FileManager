import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Theme } from '@fm/common';

interface CSSApplicatorProps {
  theme: Theme;
}

class CSSApplicator extends Component<CSSApplicatorProps> {
  componentDidMount() {
    this.updateCSSVariables();
  }

  componentDidUpdate(prevProps: CSSApplicatorProps) {
    if (this.props.theme !== prevProps.theme) {
      this.updateCSSVariables();
    }
  }

  @autobind
  updateCSSVariables() {
    document.documentElement.style.setProperty(
      '--primary-color',
      this.props.theme.primaryColor
    );
    document.documentElement.style.setProperty(
      '--primary-background-color',
      this.props.theme.primaryBackgroundColor
    );
    document.documentElement.style.setProperty(
      '--additional-background-color',
      this.props.theme.additionalBackgroundColor
    );
  }

  render() {
    return <>{this.props.children}</>;
  }
}

export { CSSApplicator };
