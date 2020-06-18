import React from 'react';
import { FileInfo } from '@fm/common';
import { DetailViewItem } from './DetailViewItem';
import { map, NumericDictionary } from 'lodash';
import './style.css';

interface DetailViewProps {
  data: FileInfo[];
  selectedIndex?: number;
  onItemClick?: (index: number) => void;
  onItemDoubleClick?: (index: number) => void;
}

const DetailView = (props: DetailViewProps) => {
  return (
    <div className="detail-view">
      <div className="detail-view__header">
        <div className="detail-view__row">
          <span className="detail-view__item detail-view__item--header">Name</span>
          <span className="detail-view__item detail-view__item--header">Size</span>
          <span className="detail-view__item detail-view__item--header">Creation Date</span>
        </div>
      </div>
      <div className="detail-view__body">
        {map(props.data, (item, i) => (
          <DetailViewItem
            data={item}
            key={item.name}
            onClick={() => props.onItemClick && props.onItemClick(i)}
            onDoubleClick={() => props.onItemDoubleClick && props.onItemDoubleClick(i)}
            selected={i === props.selectedIndex}
          />
        ))}
      </div>
    </div>
  );
};

export { DetailView };
