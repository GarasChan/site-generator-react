// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import matter from 'gray-matter';
import nextConnect from 'next-connect';
import multer from 'multer';
import { resolve } from 'path';

export type ResponseData = {
  success: boolean;
  data: Record<string, any>;
  content: string;
  name?: string;
  originName?: string;
};

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
};

const storePath = resolve(process.cwd(), 'temp');
let filename = '';

if (!fs.existsSync(storePath)) {
  fs.mkdirSync(storePath);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: storePath,
    filename: (_, file, cb) => {
      filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  }),
  preservePath: true
});

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ResponseData>) {
    res
      .status(501)
      .json({ success: false, content: error.message, data: {}, name: filename, originName: filename.split('-')[0] });
  }
});

handler.use(upload.single('file'));

handler.post((_, res: NextApiResponse<ResponseData>) => {
  const str = fs.readFileSync(resolve(storePath, filename), 'utf8');
  console.log(matter(str));
  const { content, data } = matter(str);
  res.statusCode = 200;
  res.status(200).json({ success: true, data, content, name: filename, originName: filename.split('-')[0] });
});

export default handler;
