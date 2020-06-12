import React, { useState } from 'react';
import { useManagers } from '@fm/hooks';
import { times, constant, clone, noop } from 'lodash';
import { CommandPalette, Option } from '../modals';
import './style.css';
import { PanelType, Coords } from '@fm/common';

interface PanelsEditor {
  onClose?: () => void;
}

const PanelsEditor = (props: PanelsEditor) => {
  const { settingsManager, panelsManager } = useManagers();
  const { panelsGridSize } = settingsManager.getSettings();
  const [selected, setSelected] = useState<boolean[][]>(
    Array.from(Array(panelsGridSize.yLength), () => Array.from(Array(panelsGridSize.xLength), constant(false)))
  );
  const [palette, setPalette] = useState<boolean>(false);

  const openPanel = (type: PanelType) => {
    let start: Coords | null = null;

    start: for (let i = 0; i < selected.length; i++) {
      const row = selected[i];

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        if (cell) {
          start = {
            x: j,
            y: i,
          };

          break start;
        }
      }
    }

    if (start === null) {
      return;
    }

    const span: Coords = {
      x: 0,
      y: 0,
    };

    // go through xs
    for (let i = start.x; i < selected[0].length; i++) {
      if (selected[start.y][i] === true) {
        span.x++;
      } else {
        break;
      }
    }

    // go through ys
    for (let i = start.y; i < selected.length; i++) {
      if (selected[i][start.x] === true) {
        span.y++;
      } else {
        break;
      }
    }

    for (let i = start.y; i < start.y + span.y; i++) {
      for (let j = start.x; j < start.x + span.x; j++) {
        if (selected[i][j] !== true) {
          console.error('Selected is not rectangle');
          return;
        }
      }
    }

    panelsManager.addNewPanel(type, start, span);
    props.onClose && props.onClose();
  };

  const options: Option = {
    Explorer: () => openPanel(PanelType.explorer),
    Terminal: () => openPanel(PanelType.terminal),
    Preview: () => openPanel(PanelType.preview),
  };

  const spawn = () => {
    setPalette(true);
  };

  return (
    <>
      <table className="panels-editor">
        <tbody>
          {times(panelsGridSize.yLength, (i) => (
            <tr>
              {times(panelsGridSize.xLength, (j) => (
                <td
                  className={`panels-editor__item ${selected[i][j] ? 'panels-editor__item--selected' : ''}`}
                  onClick={(event) => {
                    if (event.ctrlKey) {
                      setSelected((state) => {
                        const copy = clone(state);
                        copy[i][j] = !copy[i][j];
                        return copy;
                      });
                    }
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={spawn} className="fixed-button">
        Spawn
      </button>
      <CommandPalette isOpened={palette} onClose={() => setPalette(false)} commands={options} />
    </>
  );
};

export { PanelsEditor };
