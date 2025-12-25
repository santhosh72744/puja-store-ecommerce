// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function filenameGenerator(req: any, file: any, cb: any) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(file.originalname));
}

@Controller('upload')
export class UploadController {
  @Post('product-images')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: uploadDir, // use existing folder
        filename: filenameGenerator,
      }),
    }),
  )
  uploadProductImages(@UploadedFiles() files: any[]) {
    const thumbnailFile = files.find((f) => f.fieldname === 'thumbnail') || null;
    const galleryFiles = files.filter((f) => f.fieldname === 'gallery');

    return {
      thumbnail: thumbnailFile
        ? `/uploads/products/${thumbnailFile.filename}`
        : null,
      images: galleryFiles.map((f) => `/uploads/products/${f.filename}`),
    };
  }
}
