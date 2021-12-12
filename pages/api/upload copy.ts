// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import matter from 'gray-matter';
import nextConnect from 'next-connect';
import multer from 'multer';
import { resolve } from 'path';
import { v4 } from 'uuid';
import appConfig from '../../config/app-config.json';
import statsUtil, { FileInfo } from '../../utils/stats';
import dayjs from 'dayjs';

export interface UploadResponseData {
  data: Record<string, any>;
  content: string;
  success?: boolean;
  name?: string;
  originName?: string;
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
};

const { storeDirName, storeStatsName } = appConfig;
const storePath = resolve(process.cwd(), storeDirName);
const statsPath = resolve(storePath, `${storeStatsName}.json`);

if (!fs.existsSync(storePath)) {
  fs.mkdirSync(storePath);
}

if (!fs.existsSync(statsPath)) {
  fs.writeFileSync(statsPath, '{}', { encoding: 'utf-8' });
}

const temp = {
  originFilename: '',
  filename: '',
  createTime: '',
  updateTime: '',
  categories: [],
  tags: []
};

const upload = multer({
  storage: multer.diskStorage({
    destination: storePath,
    filename: (_, file, cb) => {
      temp.originFilename = file.originalname;
      temp.filename = `${v4()}.md`;
      const date = dayjs().format('YYYY-MM-DD HH:mm');
      temp.createTime = date;
      temp.updateTime = date;
      cb(null, temp.filename);
    }
  }),
  preservePath: true
});

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<UploadResponseData>) {
    res
      .status(501)
      .json({ success: false, content: error.message, data: {}, name: temp.filename, originName: temp.originFilename });
  }
});

handler.use(upload.single('file'));

handler.post((_, res: NextApiResponse<UploadResponseData>) => {
  const { filename, ...rest } = temp;
  const str = fs.readFileSync(resolve(storePath, filename), 'utf8');
  const { content, data } = matter(str);
  statsUtil.write(filename, { ...rest, categories: data.categories, tags: data.tags });
  res.status(200).json({ success: true, data, content, name: filename, originName: filename.split('-')[1] });
});

export default handler;
