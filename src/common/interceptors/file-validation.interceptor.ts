import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnprocessableEntityException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import Busboy from 'busboy';
import fs from 'fs';
import { PassThrough } from 'stream';
import path from 'path';
import fn from '../utils/getFileTypeFromStream';
import { MediaService } from 'src/modules/media/media.service';
import { RequestUser } from '../../modules/auth/entities/request-user.entity';
import { fileStatAsync } from 'src/common/utils/fileStatAsync';
import { Reflector } from '@nestjs/core';
import { MEDIA_TARGET } from '../decorators/file-target.decorator';
import { MediaTarget } from '@prisma/client';
import { parseMediaParams } from '../utils/parseMediaParams';
import { fileTargetMap } from '../utils/getFilePath';
import { validateField } from '../utils/validateField';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly mediaService: MediaService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get metadata from the route handler
    const mediaTarget = this.reflector.get<MediaTarget>(
      MEDIA_TARGET,
      context.getHandler(),
    );
    // it prevents the other ts error
    // as 'PROFILE_PICTURE';

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: RequestUser }>();
    const targetPath = fileTargetMap[mediaTarget](
      // @ts-ignore
      ...parseMediaParams[mediaTarget](request),
    );
    const id = validateField(request.params, 'id', 'integer');

    const range = request.headers['content-range'];
    if (typeof range !== 'string' && !/(\d+)-(\d+)\/(\d+)/.test(range)) {
      throw new BadRequestException(`Invalid header "content-range"`);
    }
    let [_, start, end, size] = range.match(
      /(\d+)-(\d+)\/(\d+)/,
    ) as unknown as number[];
    (start = +start), (end = +end), (size = +size);

    const busboy = Busboy({ headers: request.headers });
    let validFileType = null as null | string;
    let chunk = null;
    let countSize = 0;

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
        const expectedFileName = `${request.user.id}_${id}.${fileType.ext}`;
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
