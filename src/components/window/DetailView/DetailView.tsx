import React from 'react';
import { IFile } from '@fm/explorer';
import { DetailViewItem } from './DetailViewItem';
import './style.css';

interface DetailViewProps {
  data: IFile[];
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
        {props.data.map((item, i) => (
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
