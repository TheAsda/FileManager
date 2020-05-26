import React from 'react';
import { IFile } from '@fm/explorer';
import { DetailViewItem } from './DetailViewItem';

interface DetailViewProps {
  data: IFile[];
}

const DetailView = (props: DetailViewProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, i) => (
            <DetailViewItem key={item.name} data={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { DetailView };
