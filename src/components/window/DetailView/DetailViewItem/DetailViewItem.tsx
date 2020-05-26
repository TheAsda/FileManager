import React from 'react';
import { IFile } from '@fm/explorer';
import './style.css';

interface DetailViewItemProps {
  data: IFile;
}

const DetailViewItem = (props: DetailViewItemProps) => {
  return (
    <tr>
      <td>{props.data.name}</td>
      <td>{props.data.size}</td>
      <td>{props.data.creationDate.toDateString()}</td>
    </tr>
  );
};

export { DetailViewItem };
