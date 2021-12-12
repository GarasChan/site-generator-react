import { FileInfo, FileStatusType } from './../../utils/stats';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import { resolve } from 'path';
import appConfig from '../../config/app-config.json';
import statsUtil from '../../utils/stats';
import dayjs from 'dayjs';

export interface UploadResponseData extends Partial<FileInfo> {
  success?: boolean;
  filename?: string;
  content: string;
}

const storePath = resolve(process.cwd(), appConfig.storeDirName);

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<UploadResponseData>) {
    console.log(error);
    res.status(501).json({ success: false, content: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<UploadResponseData>) => {
  const { id, filename, data, content } = req.body;
  const file = stringify(content, data);
  const serverFilename = `${id}.md`;
  fs.writeFileSync(resolve(storePath, serverFilename), file, { encoding: 'utf-8' });
  const time = dayjs().format('YYYY-MM-DD HH:mm');
  const info = {
    originFilename: filename,
    createTime: time,
    updateTime: time,
    status: FileStatusType.UPLOADED,
    categories: data.categories,
    tags: data.tags
  };
  statsUtil.write(serverFilename, info);
  res.status(200).json({ success: true, content: file, ...info, filename: serverFilename });
});

export default handler;
