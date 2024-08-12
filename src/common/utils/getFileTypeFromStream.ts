import type { AnyWebReadableStream, FileTypeResult } from 'file-type';
import internal from 'stream';

const fn = {
  fileTypeFromStream: null as
    | null
    | ((
        stream: AnyWebReadableStream<Uint8Array> | internal.Readable,
      ) => Promise<FileTypeResult | undefined>),
};


export default fn;