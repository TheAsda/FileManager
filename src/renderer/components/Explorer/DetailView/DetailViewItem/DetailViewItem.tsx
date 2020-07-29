import React, { useEffect, useRef } from 'react';
import { extname } from 'path';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';
import { FolderIcon } from 'renderer/components';


interface DetailViewItemProps {
  name: string;
  size?: number;
  created?: Date;
  isFolder?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  editable?: boolean;
  onEditEnd?: (name: string | null) => void;
  showIcon?: boolean;
}

const getIcon = (isFolder: boolean, file: string) => {
  if (isFolder) {
    return <FolderIcon />;
  }

  const ext = extname(file).slice(1);

  return <FileIcon extension={ext} {...defaultStyles[ext as DefaultExtensionType]} />;
};

const DetailViewItem = (props: DetailViewItemProps) => {
  const classes = ['detail-view__row'];
  const inputRef = useRef<HTMLInputElement>(null);

  if (props.selected) {
    classes.push('detail-view__row--selected');
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && inputRef.current) {
      props.onEditEnd && props.onEditEnd(inputRef.current.value);
    }

    if (event.key === 'Escape') {
      props.onEditEnd && props.onEditEnd(null);
    }
  };

  useEffect(() => {
    if (props.editable) {
      document.addEventListener('keydown', handleKeyboard);
      return () => {
        document.removeEventListener('keydown', handleKeyboard);
      };
    } else {
      document.removeEventListener('keydown', handleKeyboard);
    }
  }, [props.editable]);

  return (
    <div
      className={classes.join(' ')}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      ref={(ref) =>
        props.selected &&
        ref?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    >
      <span className="detail-view__item">
        {props.editable ? (
          <input defaultValue={props.name} ref={inputRef} autoFocus />
        ) : (
          <>
            {props.showIcon !== false && getIcon(props.isFolder ?? false, props.name)}
            {props.name}
          </>
        )}
      </span>
      <span className="detail-view__item">{props.size}</span>
      <span className="detail-view__item">{props.created?.toLocaleString()}</span>
    </div>
  );
};

export { DetailViewItem };
