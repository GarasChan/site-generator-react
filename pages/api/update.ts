// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import { resolve } from 'path';
import appConfig from '../../config/app-config.json';
import statsUtil from '../../utils/stats';
import dayjs from 'dayjs';

export type UploadResponseData = {
  success?: boolean;
  content: string;
};

const storePath = resolve(process.cwd(), appConfig.storeDirName);

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
  statsUtil.write(name, {
    updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
    categories: data.categories,
    tags: data.tags
  });
  res.status(200).json({ success: true, content: file });
});

export default handler;
