import React from 'react';
import { FileInfo } from '@fm/explorer';
import './style.css';

interface DetailViewItemProps {
  data: FileInfo;
  selected?: boolean;
}

const DetailViewItem = (props: DetailViewItemProps) => {
  return (
    <tr className={props.selected ? 'detail-view__item--selected' : ''}>
      <td>{props.data.name}</td>
      <td>{props.data.size}</td>
      <td>{props.data.creationDate.toDateString()}</td>
    </tr>
  );
};

export { DetailViewItem };
