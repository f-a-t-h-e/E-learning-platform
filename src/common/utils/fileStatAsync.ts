import { stat, type Stats } from 'fs';

export async function fileStatAsync(filePath: string) {
  return new Promise<Stats|0>((resolve, reject) => {
    stat(filePath, function (err, stats) {
      if (err) {
        if ('ENOENT' == err.code) {
          return resolve(0);
        } else {
          return reject(err);
        }
      } else {
        return resolve(stats);
      }
    });
  });
}
