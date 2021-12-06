// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import matter from 'gray-matter';
import nextConnect from 'next-connect';
import multer from 'multer';
import { resolve } from 'path';

export type UploadResponseData = {
  success?: boolean;
  content: string;
};

const storePath = resolve(process.cwd(), 'temp');

if (!fs.existsSync(storePath)) {
  fs.mkdirSync(storePath);
}

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<UploadResponseData>) {
    res.status(501).json({ success: false, content: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<UploadResponseData>) => {
  console.log(req);
  res.statusCode = 200;
  res.status(200).json({ success: true, content: '' });
});

export default handler;
