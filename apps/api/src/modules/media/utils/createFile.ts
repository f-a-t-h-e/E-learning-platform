import fs from 'fs';
export async function createFile(filePath: string) {
  return new Promise<true>((resolve, reject) => {
    // Create an empty file
    fs.open(filePath, 'w', (err, fd) => {
      if (err) {
        console.error('Error creating file:', err);
        reject(err);
        return;
      }
      fs.close(fd, (err) => {
        if (err) {
          console.error('Error closing file:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  });
}
