// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { resolvePath } from '../../../utils/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { stringify } from 'gray-matter';
import nextConnect from 'next-connect';
import dayjs from 'dayjs';
import { getAuthor } from '../author';
import { join } from 'path';
import { Article, ArticleResponseData, ArticleStatus } from '../../../types';
import { withSessionRoute } from '../../../lib/with-session';
import { articleDB } from '../../../utils/server/db';

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
  articleDB.read();
  if (!articleDB.data) {
    articleDB.data = [];
    return {
      total: 0,
      articles: []
    };
  }
  const total = articleDB.data.length;
  let articles = articleDB.data;
  if (typeof id === 'string') {
    const article = articleDB.data.find((item) => item.id === id);
    articles = article ? [article] : [];
  }
  if (pageSize && pageNumber) {
    articles = articleDB.data.slice(pageSize * (pageNumber - 1), pageSize * pageNumber);
  }
  return {
    total,
    articles
  };
};

const write = (article: Partial<Article>) => {
  articleDB.read();
  if (!Array.isArray(articleDB.data)) {
    articleDB.data = [article as Article];
  } else {
    const current = articleDB.data.find((item) => item.id === article.id);
    if (!current) {
      articleDB.data.unshift(article as Article);
    } else {
      Object.assign(current, article);
    }
  }
  articleDB.write();
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

export default withSessionRoute(handler);
