// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import multer from 'multer';
import { resolve } from 'path';

export type UploadResponseData = {
  success?: boolean;
  content: string;
};

const storePath = resolve(process.cwd(), 'temp');

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<UploadResponseData>) {
    res.status(501).json({ success: false, content: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<UploadResponseData>) => {
  const { query, body } = req;
  const { name } = query;

  if (typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ success: false, content: '参数异常' });
    return;
  }

  const { data, content } = body;
  const file = stringify(content, data);
  fs.writeFileSync(resolve(storePath, name), file, { encoding: 'utf-8' });
  res.status(200).json({ success: true, content: file });
});

export default handler;
