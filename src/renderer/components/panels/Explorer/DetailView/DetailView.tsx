import React from 'react';
import { FileInfo } from '@fm/common';
import { DetailViewItem } from './DetailViewItem';
import { reduce, map } from 'lodash';
import './style.css';

interface DetailViewProps {
  data: FileInfo[];
  selectedIndex?: number;
}

const DetailView = (props: DetailViewProps) => {
  return (
    <table className="detail-view">
      <thead className="detail-view__header">
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Creation Date</th>
        </tr>
      </thead>
      <tbody className="detail-view__body">
        {map(props.data, (item, i) => (
          <DetailViewItem
            key={item.name}
            data={item}
            selected={i === props.selectedIndex}
          />
        ))}
      </tbody>
    </table>
  );
};

export { DetailView };
