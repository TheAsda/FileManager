const readdirSync = (path: string) => {
  return ['test.txt', 'Folder'];
};

const statSync = (path: string) => {
  switch (path) {
    case 'D:/test.txt':
      return {
        dev: 3893025070,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 844424930598715,
        size: 11,
        blocks: 0,
        atimeMs: 1590517543871.4924,
        mtimeMs: 1590517543871.4924,
        ctimeMs: 1590517543871.4924,
        birthtimeMs: 1590438064261.6824,
        atime: new Date('2020-05-26T18:25:43.871Z'),
        mtime: new Date('2020-05-26T18:25:43.871Z'),
        ctime: new Date('2020-05-26T18:25:43.871Z'),
        birthtime: new Date('2020-05-25T20:21:04.262Z'),
        isDirectory: () => false,
      };
    case 'D:/Folder':
      return {
        dev: 3893025070,
        mode: 16822,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 1125899907323202,
        size: 0,
        blocks: 0,
        atimeMs: 1590438122097.1538,
        mtimeMs: 1590438122097.1538,
        ctimeMs: 1590438122097.1538,
        birthtimeMs: 1590438122097.1538,
        atime: new Date('2020-05-25T20:22:02.097Z'),
        mtime: new Date('2020-05-25T20:22:02.097Z'),
        ctime: new Date('2020-05-25T20:22:02.097Z'),
        birthtime: new Date('2020-05-25T20:22:02.097Z'),
        isDirectory: () => true,
      };
  }
};

export { readdirSync, statSync };
