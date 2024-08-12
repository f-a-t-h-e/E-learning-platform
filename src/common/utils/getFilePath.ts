import { join } from 'path';
export function getFilePath({
  extension,
  mediaId,
  userId,
}: {
  userId: number;
  mediaId: number;
  extension: string;
}) {
  return join(process.cwd(), 'uploads', `${userId}_${mediaId}.${extension}`);
}
