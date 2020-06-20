import React from 'react';
import { extname } from 'path';

interface DetailViewItemProps {
  name: string;
  size?: number;
  created?: Date;
  isFolder?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const getIcon = (file: string): string => {
  const ext = extname(file);
  console.log(file, ext);

  switch (ext) {
    case '.ai':
      return 'icons://ai.svg';
    case '.doc':
      return 'icons://doc.svg';
    case '.gif':
      return 'icons://gif.svg';
    case '.jpg':
      return 'icons://jpg.svg';
    case '.mpg':
      return 'icons://mpg.svg';
    case '.pptx':
      return 'icons://pptx.svg';
    case '.swf':
      return 'icons://swf.svg';
    case '.xlsx':
      return 'icons://xlsx.svg';
    case '.avi':
      return 'icons://avi.svg';
    case '.docx':
      return 'icons://docx.svg';
    case '.htm':
      return 'icons://htm.svg';
    case '.js':
      return 'icons://js.svg';
    case '.pdf':
      return 'icons://pdf.svg';
    case '.ps':
      return 'icons://ps.svg';
    case '.tif':
      return 'icons://tif.svg';
    case '.zip':
      return 'icons://zip.svg';
    case '.bmp':
      return 'icons://bmp.svg';
    case '.dwg':
      return 'icons://dwg.svg';
    case '.html':
      return 'icons://html.svg';
    case '.mov':
      return 'icons://mov.svg';
    case '.php':
      return 'icons://php.svg';
    case '.psd':
      return 'icons://psd.svg';
    case '.txt':
      return 'icons://txt.svg';
    case '.dat':
      return 'icons://dat.svg';
    case '.eps':
      return 'icons://eps.svg';
    case '.java':
      return 'icons://java.svg';
    case '.mp3':
      return 'icons://mp3.svg';
    case '.png':
      return 'icons://png.svg';
    case '.rar':
      return 'icons://rar.svg';
    case '.wav':
      return 'icons://wav.svg';
    case '.dmg':
      return 'icons://dmg.svg';
    case '.folder':
      return 'icons://folder.svg';
    case '.jpeg':
      return 'icons://jpeg.svg';
    case '.mp4':
      return 'icons://mp4.svg';
    case '.ppt':
      return 'icons://ppt.svg';
    case '.xls':
      return 'icons://xls.svg';

    default:
      return '';
  }
};

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
      <span className="detail-view__item">
        <img src={props.isFolder ? 'icons://folder.svg' : getIcon(props.name)} />
        {props.name}
      </span>
      <span className="detail-view__item">{props.size}</span>
      <span className="detail-view__item">{props.created?.toLocaleString()}</span>
    </div>
  );
};

export { DetailViewItem };
