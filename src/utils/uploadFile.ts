import * as path from 'path';
import { Request, Response } from 'express';
import multer from 'multer';

const uploadFilePath = path.resolve(__dirname, '../..', 'public/uploads');

const storage: multer.StorageEngine = multer.diskStorage({
  destination: uploadFilePath,
  filename(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void): void {
    callback(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const extension: boolean = ['.png', '.jpg', '.jpeg'].includes(path.extname(file.originalname).toLowerCase());
    const mimeType: boolean = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype);

    if (extension && mimeType) {
      return callback(null, true);
    }

    callback(new Error('Invalid file type. Only PNG and JPG are allowed'));
  },
}).single('picture');

export const handleSingleUploadFile = async (req: Request, res: Response): Promise<{ file: Express.Multer.File; body: unknown }> => {
  return new Promise((resolve, reject): void => {
    uploadFile(req, res, (error) => {
      if (error) {
        reject(error);
      }

      resolve({ file: req.file, body: req.body });
    });
  });
};
