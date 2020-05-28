import React, { Component, RefObject, createRef } from 'react';
import { spawn, IPty } from 'node-pty';
import { Terminal } from 'xterm';
import { platform, homedir } from 'os';
import 'xterm/css/xterm.css';

class Console extends Component {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: Terminal;
  private process?: IPty;

  constructor(props: {}) {
    super(props);

    this.containerRef = createRef<HTMLDivElement>();
    this.terminal = new Terminal();
  }

  attach = () => {
    if (!this.process) {
      console.error('Terminal process has not been inicialized');
      return;
    }

    this.terminal.onData((data) => {
      this.process!.write(data);
    });
    this.process.onData((data) => {
      this.terminal.write(data);
    });
  };

  componentDidMount() {
    if (this.containerRef.current) {
      this.terminal.open(this.containerRef.current);
      const shell = platform() === 'win32' ? 'cmd.exe' : 'bash';
      this.process = spawn(shell, [], {
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

export { Console };
