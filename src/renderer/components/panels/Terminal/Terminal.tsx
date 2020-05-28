import React, { Component, RefObject, createRef } from 'react';
import { remote } from 'electron';
import { IPty } from 'node-pty';
import { Terminal as Term } from 'xterm';
import { platform, homedir } from 'os';
import 'xterm/css/xterm.css';

class Terminal extends Component {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: Term;
  private process?: IPty;

  constructor(props: {}) {
    super(props);

    this.containerRef = createRef<HTMLDivElement>();
    this.terminal = new Term();
  }

  attach = () => {
    if (!this.process) {
      console.error('Terminal process has not been inicialized');
      return;
    }

    this.terminal.onData((data) => {
      this.process!.write(data);
    });
    this.process.onData((data: string | Uint8Array) => {
      this.terminal.write(data);
    });
  };

  componentDidMount() {
    if (this.containerRef.current) {
      this.terminal.open(this.containerRef.current);
      const shell = platform() === 'win32' ? 'bash.exe' : 'bash';
      this.process = remote.require('node-pty').spawn(shell, [], {
        cwd: homedir(),
      });
      this.attach();
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
