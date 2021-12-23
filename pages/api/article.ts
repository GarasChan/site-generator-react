// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Article, FileStatusType } from '../../utils/ArticleUtil';
import { resolvePath } from '../../utils/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import appConfig from '../../config/app-config.json';
import dayjs from 'dayjs';
import articleUtil from '../../utils/ArticleUtil';
import authorUtil from '../../utils/AutherUtil';
import { join } from 'path';

export interface ArticleResponse {
  success: boolean;
  data: any;
  file?: string;
}

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleResponse>) {
    console.log(error);
    res.status(501).json({ success: false, data: error.message });
  }
});

const articleDir = resolvePath(appConfig.articlePath);

const formatFile = (content: string, data: any) => {
  const { author: authorId, ...rest } = data;
  const [author] = authorUtil.get(authorId);
  return stringify(`${content}\n![${author.name}](${author.descImg})`, rest);
};

handler.get((req: NextApiRequest, res: NextApiResponse<ArticleResponse>) => {
  const { query } = req;
  const { id } = query;
  const info = articleUtil.get(id as string);
  res.status(200).json({ success: true, data: info });
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleResponse>) => {
  const { id, filename, data, content } = req.body;

  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir);
  }

  const file = formatFile(content, data);
  const serverFilename = `${id}.md`;
  const time = dayjs().format('YYYY-MM-DD HH:mm');
  const info: Article = {
    id,
    filename: serverFilename,
    originFilename: filename,
    createTime: time,
    updateTime: time,
    status: FileStatusType.UPLOADED,
    ...data
  };
  fs.writeFileSync(join(articleDir, serverFilename), file, { encoding: 'utf-8' });

  articleUtil.write(info);
  res.status(200).json({ success: true, file, data: info });
});

export default handler;
