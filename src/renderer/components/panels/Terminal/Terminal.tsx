import React, { Component, RefObject, createRef } from 'react';
import { Terminal as Term } from 'xterm';
import 'xterm/css/xterm.css';
import { ITerminalManager } from '@fm/common';

interface TerminalProps {
  terminalManager: ITerminalManager;
  initialDirectory?: string;
  onExit?: (exitCode: number) => void;
}

class Terminal extends Component<TerminalProps> {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: Term;
  private TerminalManager: ITerminalManager;

  constructor(props: TerminalProps) {
    super(props);

    this.TerminalManager = props.terminalManager;
    this.containerRef = createRef<HTMLDivElement>();
    this.terminal = new Term();
  }

  componentDidMount() {
    if (this.containerRef.current) {
      this.terminal.open(this.containerRef.current);
      this.TerminalManager.attach(this.terminal, this.props.onExit);
      this.props.initialDirectory && this.TerminalManager.changeDirectory(this.props.initialDirectory);
    }
  }

  componentWillUnmount() {
    this.terminal.dispose();
  }

  render() {
    return <div ref={this.containerRef} />;
  }
}

export { Terminal };
