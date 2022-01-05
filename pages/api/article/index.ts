// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { resolvePath } from '../../../utils/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import dayjs from 'dayjs';
import { getAuthor } from '../author';
import { join } from 'path';
import { JSONFileSync, LowSync } from 'lowdb';
import { Article, ArticleResponseData, ArticleStatus } from '../../../types';

const db = new LowSync<Article[]>(new JSONFileSync(resolvePath([process.env.DB_PATH!, 'article.json'])));
const articleDir = resolvePath(process.env.ARTICLE_PATH!);

const get = (params: {
  id?: string;
  pageSize?: number;
  pageNumber?: number;
}): {
  total: number;
  articles: Article[];
} => {
  const { id, pageNumber, pageSize } = params;
  db.read();
  if (!db.data) {
    db.data = [];
    return {
      total: 0,
      articles: []
    };
  }
  const total = db.data.length;
  let articles = db.data;
  if (typeof id === 'string') {
    const article = db.data.find((item) => item.id === id);
    articles = article ? [article] : [];
  }
  if (pageSize && pageNumber) {
    articles = db.data.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
  }
  return {
    total,
    articles
  };
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
    res.status(501).json({ message: error.message });
  }
});

const formatFile = (content: string, data: any) => {
  const { author: authorId, ...rest } = data;
  const [author] = getAuthor(authorId);
  return stringify(`${content}\n![${author.name}](${author.descImg})`, rest);
};

handler.get((req: NextApiRequest, res: NextApiResponse<ArticleResponseData>) => {
  const { query } = req;
  const { id, pageSize, pageNumber } = query;
  const info = get({ id: id as string, pageSize: +pageSize, pageNumber: +pageNumber });
  res.status(200).json(info);
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleResponseData>) => {
  const { id, filename, meta, content } = req.body;

  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir);
  }

  const file = formatFile(content, meta);
  const serverFilename = `${id}.md`;
  const time = dayjs().format('YYYY-MM-DD HH:mm');
  const info: Article = {
    id,
    filename: serverFilename,
    originFilename: filename,
    createTime: time,
    updateTime: time,
    status: ArticleStatus.UPLOADED,
    ...meta
  };
  fs.writeFileSync(join(articleDir, serverFilename), file, { encoding: 'utf-8' });

  write(info);
  res.status(200).end();
});

export default handler;
