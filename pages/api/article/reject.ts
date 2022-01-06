// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { JSONFileSync, LowSync } from 'lowdb';
import { Article, ArticleAgreeResponseData, ArticleStatus } from '../../../types';
import { resolvePath, sendEmail } from '../../../utils/server';
import { getAuthor } from '../author';

const db = new LowSync<Article[]>(new JSONFileSync(resolvePath(['db', 'article.json'])));

const update = (article: Partial<Article>) => {
  db.read();
  if (Array.isArray(db.data)) {
    const current = db.data.find((item) => item.id === article.id);
    if (current) {
      Object.assign(current, article);
      db.write();
      return { success: true, articles: [current] };
    }
  }
  return {
    success: false,
    message: '没有找到该文章'
  };
};

const formatMessage = ({ createTime, title }: { createTime: string; title: string }) => {
  return (
    process.env.EMAIL_REJECTED_TEMPLATE?.replaceAll('{{time}}', ` ${createTime || 'unknown'} `)?.replaceAll(
      '{{title}}',
      `《${title || 'unknown'}》`
    ) || ''
  );
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleAgreeResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleAgreeResponseData>) => {
  const { id } = req.query;
  // const { reason } = req.body;

  if (!id) {
    res.status(400).json({ message: '请求参数异常' });
    return;
  }

  const { success, message, articles } = update({ id: id as string, status: ArticleStatus.REJECTED });

  if (!success || !articles) {
    res.status(404).json({ message });
    return;
  }

  // TODO: 挪动文章位置到发布文件夹
  res.status(200).json({ articles });

  // 发送邮件通知
  const { author, title, createTime } = articles?.[0];
  const { email } = getAuthor(author)[0];
  if (email) {
    sendEmail({
      to: email,
      subject: '文章退回提醒',
      text: formatMessage({ createTime, title })
    }).then((result) => {
      console.log(result.error || result.message);
    });
  }
});

export default handler;
