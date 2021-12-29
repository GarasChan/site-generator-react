// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { resolvePath } from '../../../utils/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import appConfig from '../../../config/app-config.json';
import dayjs from 'dayjs';
import { getAuthor } from '../author';
import { join, resolve } from 'path';
import { JSONFileSync, LowSync } from 'lowdb';
import { Article, ArticleResponseData, ArticleStatus } from '../../../types';

const db = new LowSync<Article[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'article.json')));

const get = (id?: string): Article[] => {
  db.read();
  if (!db.data) {
    return [];
  }
  if (typeof id === 'string') {
    const article = db.data.find((item) => item.id === id);
    return article ? [article] : [];
  }
  return db.data;
};

const write = (article: Partial<Article>) => {
  db.read();
  if (!Array.isArray(db.data)) {
    db.data = [article as Article];
  } else {
    const current = db.data.find((item) => item.id === article.id);
    if (!current) {
      db.data.unshift(article as Article);
    } else {
      Object.assign(current, article);
    }
  }
  db.write();
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleResponseData>) {
    res.status(501).json({ success: false, message: error.message });
  }
});

const articleDir = resolvePath(appConfig.articlePath);

const formatFile = (content: string, data: any) => {
  const { author: authorId, ...rest } = data;
  const [author] = getAuthor(authorId);
  return stringify(`${content}\n![${author.name}](${author.descImg})`, rest);
};

handler.get((req: NextApiRequest, res: NextApiResponse<ArticleResponseData>) => {
  const { query } = req;
  const { id } = query;
  const info = get(id as string);
  res.status(200).json({ success: true, data: info });
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleResponseData>) => {
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
    status: ArticleStatus.UPLOADED,
    ...data
  };
  fs.writeFileSync(join(articleDir, serverFilename), file, { encoding: 'utf-8' });

  write(info);
  res.status(200).json({ success: true, file, data: [info] });
});

export default handler;
