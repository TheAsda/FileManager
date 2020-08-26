import { FileInfo } from '@fm/common';
import { createEvent } from 'effector';
import { previewStore, resizePreview, setPreviewFile, togglePreview } from '../previewStore';

describe('Preview store', () => {
  const reset = createEvent();
  previewStore.reset(reset);

  beforeEach(() => {
    reset();
  });

  it('should resize on event call', () => {
    resizePreview(100);

    expect(previewStore.getState().width).toBe(100);

    resizePreview(56);

    expect(previewStore.getState().width).toBe(56);
  });

  it('should toggle on event call', () => {
    const initialHidden = previewStore.getState().hidden;

    togglePreview();

    expect(previewStore.getState().hidden).toBe(!initialHidden);

    togglePreview();

    expect(previewStore.getState().hidden).toBe(initialHidden);
  });

  it('should set file on event call', () => {
    const file: FileInfo = {
      name: 'test',
      path: 'path/',
      attributes: {
        directory: false,
        hidden: false,
        readonly: false,
        system: false,
      },
    };

    setPreviewFile(file);

    expect(previewStore.getState().file).toEqual(file);
  });
});
