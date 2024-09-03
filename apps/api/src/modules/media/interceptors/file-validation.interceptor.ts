import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import Busboy from 'busboy';
import fs from 'fs';
import { PassThrough } from 'stream';
import path from 'path';
import fn from '../utils/getFileTypeFromStream';
import { MediaService } from '../media.service';
import { RequestUser } from '../../auth/entities/request-user.entity';
import { fileStatAsync } from '../utils/fileStatAsync';
import { parseMediaFields } from '../utils/parseMediaFields';
import { fileTargetMap } from '../utils/fileTargetMap';
import { validateField } from 'common/utils/validateField';
import { MediaPurposeEnum } from '../media-purpose.enum';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private readonly mediaService: MediaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: RequestUser }>();

    const id = validateField(request.params, 'id', 'integer');
    const purpose = validateField(
      request.params,
      'purpose',
      'enum',
      MediaPurposeEnum,
    );
    const targetPath = fileTargetMap[purpose](
      // @ts-expect-error This returns the correct values as it has the same mapping
      parseMediaFields[purpose](request.query, request.user),
    );

    const range = request.headers['content-range'];
    if (typeof range !== 'string' && !/(\d+)-(\d+)\/(\d+)/.test(range)) {
      throw new BadRequestException(`Invalid header "content-range"`);
    }
    let [, start, end, size] = range.match(
      /(\d+)-(\d+)\/(\d+)/,
    ) as unknown as number[];
    (start = +start), (end = +end), (size = +size);

    const busboy = Busboy({ headers: request.headers });
    let validFileType = null as null | string;
    let chunk = null;
    // const countSize = 0;

    busboy.on('file', async (_, file) => {
      if (!fn.fileTypeFromStream) {
        console.log('fileTypeFromStream Not found');
        return;
      }

      const readFileBytes = async () => {
        chunk = file.read(4100); // ~ 4kb
        if (!chunk) {
          return file.once('readable', readFileBytes);
        }
        const stream = new PassThrough();
        stream.end(chunk);
        const fileType = await fn.fileTypeFromStream(stream);
        if (!fileType) {
          // fail
          file.resume();
          throw new BadRequestException(`Invalid file type`);
        }
        const expectedType = this.mediaService.getType(fileType.mime);
        if (!expectedType) {
          // fail
          file.resume();
          throw new BadRequestException(`Invalid file type`);
        }
        // Get the file name
        validFileType = fileType.mime;
        const expectedFileName = `${request.user.userId}_${id}.${fileType.ext}`;
        const expectedFilePath = path.join(
          process.cwd(),
          ...targetPath,
          expectedFileName,
        );
        try {
          const fileStats = await fileStatAsync(expectedFilePath);
          if (!fileStats) {
            throw new BadRequestException(
              `You don't have a ready file for upload with this id`,
            );
          }
          if (start > fileStats.size) {
            throw new BadRequestException(
              `You haven't reached this point of downloading`,
            );
          }
          const saveTo = fs.createWriteStream(expectedFilePath, {
            flags: start == 0 ? 'w' : 'r+',
          });
          saveTo.write(chunk);
          file.pipe(saveTo);
        } catch (error) {
          throw new BadRequestException();
        }
      };
      readFileBytes();
    });

    busboy.on('finish', () => {
      if (!validFileType) {
        throw new UnprocessableEntityException();
      }
    });

    // busboy.on("error", (err)=>{
    //   console.log(err);
    //   throw new InternalServerErrorException();
    // })

    request.pipe(busboy);
    return next.handle();
  }
}
