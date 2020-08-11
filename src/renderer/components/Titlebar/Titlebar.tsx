import React, { useState } from 'react';
import './style.css';
import { ipcRenderer } from 'electron';

const Titlebar = () => {
  const [isActive, setIsActive] = useState<boolean>();
  const [isMaximized, setIsMaximized] = useState<boolean>();

  ipcRenderer.on('focused', () => {
    setIsActive(true);
  });

  ipcRenderer.on('blurred', () => {
    setIsActive(false);
  });

  ipcRenderer.on('maximized', () => {
    setIsMaximized(true);
  });

  ipcRenderer.on('unmaximized', () => {
    setIsMaximized(false);
  });

  const minimizeHandler = () => {
    ipcRenderer.invoke('minimize-event');
  };

  const maximizeHandler = () => {
    ipcRenderer.invoke('maximize-event');
  };

  const unmaximizeHandler = () => {
    ipcRenderer.invoke('unmaximize-event');
  };

  const closeHandler = () => {
    ipcRenderer.invoke('close-event');
  };

  return (
    <div className="Titlebar">
      <div className={isActive ? 'Title-Bar' : 'Title-Bar-inactive'}>
        <div className="Titlebar-drag-region"></div>
        <div className="Title-Bar__section-icon"></div>
        <div className="Title-Bar__section-menubar"></div>
        <div className="Title-Bar__section-center"></div>
        <div className="Title-Bar__section-windows-control">
          <div className="section-windows-control_box">
            <svg
              height="14"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={isActive ? 'minimize-active_logo' : 'minimize-inactive_logo'}
                cx="11.6"
                cy="11.6"
                onClick={minimizeHandler}
                r="11.4"
              />
            </svg>
          </div>
          {isMaximized ? (
            <div className="section-windows-control_box">
              <svg
                height="14"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className={isActive ? 'unmaximize-active_logo' : 'unmaximize-inactive_logo'}
                  cx="11.6"
                  cy="11.6"
                  onClick={unmaximizeHandler}
                  r="11.4"
                />
              </svg>
            </div>
          ) : (
            <div className="section-windows-control_box">
              <svg
                height="14"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className={isActive ? 'maximize-active_logo' : 'maximize-inactive_logo'}
                  cx="11.6"
                  cy="11.6"
                  onClick={maximizeHandler}
                  r="11.4"
                />
              </svg>
            </div>
          )}
          <div className="section-windows-control_box">
            <svg
              height="14"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={isActive ? 'close-active_logo' : 'close-inactive_logo'}
                cx="11.6"
                cy="11.6"
                onClick={closeHandler}
                r="11.4"
              />
            </svg>
          </div>
        </div>
        <div className="resizer" style={isMaximized ? { display: 'none' } : {}}></div>
      </div>
    </div>
  );
};

export { Titlebar };
