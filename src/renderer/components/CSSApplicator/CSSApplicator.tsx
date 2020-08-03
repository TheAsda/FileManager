import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Theme } from '@fm/common';
import { toPairs, forEach, isNumber } from 'lodash';

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
    forEach(toPairs(this.props.theme), (pair) => {
      document.documentElement.style.setProperty(
        `--${pair[0]}`,
        isNumber(pair[1]) ? `${pair[1]}px` : pair[1]
      );
    });
  }

  render() {
    return <>{this.props.children}</>;
  }
}

export { CSSApplicator };
