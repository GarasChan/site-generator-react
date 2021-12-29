// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import appConfig from '../../../config/app-config.json';
import { resolve } from 'path';
import { JSONFileSync, LowSync } from 'lowdb';
import { Article, ArticleAgreeResponseData, ArticleStatus } from '../../../types';

const db = new LowSync<Article[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'article.json')));

const update = (article: Partial<Article>) => {
  db.read();
  if (Array.isArray(db.data)) {
    const current = db.data.find((item) => item.id === article.id);
    if (current) {
      Object.assign(current, article);
      db.write();
      return { success: true };
    }
  }
  return {
    success: false,
    message: '没有找到该文章'
  };
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleAgreeResponseData>) {
    res.status(501).json({ success: false, message: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleAgreeResponseData>) => {
  const { id } = req.body;

  const { success, message = '' } = update({ id, status: ArticleStatus.REVIEWED });

  if (!success) {
    res.status(404).json({ success, message });
  }

  // TODO: 挪动文章位置到发布文件夹
  res.status(200).json({ success: true });
});

export default handler;
