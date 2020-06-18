import React from 'react';
import { FileInfo } from '@fm/common';

interface DetailViewItemProps {
  data: FileInfo;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const DetailViewItem = (props: DetailViewItemProps) => {
  const classes = ['detail-view__row'];

  if (props.selected) {
    classes.push('detail-view__row--selected');
  }

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
      <span className="detail-view__item">{props.data.name}</span>
      <span className="detail-view__item">{props.data.size}</span>
      <span className="detail-view__item">{props.data.created?.toLocaleString()}</span>
    </div>
  );
};

export { DetailViewItem };
