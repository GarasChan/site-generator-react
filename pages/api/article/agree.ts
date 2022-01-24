import { getAuthor } from './../author';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Article, ArticleAgreeResponseData, ArticleStatus } from '../../../types';
import { getArticleLink, sendEmail } from '../../../utils/server';
import { articleDB } from '../../../utils/server/db';

const update = (article: Partial<Article>) => {
  articleDB.read();
  if (Array.isArray(articleDB.data)) {
    const current = articleDB.data.find((item) => item.id === article.id);
    if (current) {
      Object.assign(current, article);
      articleDB.write();
      return { success: true, articles: [current] };
    }
  }
  return {
    success: false,
    message: '没有找到该文章'
  };
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleAgreeResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.post(async (req: NextApiRequest, res: NextApiResponse<ArticleAgreeResponseData>) => {
  const id = req.query.id as string;

  if (!id) {
    res.status(400).json({ message: '请求参数异常' });
    return;
  }

  const { success, message, articles } = update({ id: id as string, status: ArticleStatus.REVIEWED });

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
    const link = getArticleLink(id, title, req.headers.origin);
    sendEmail({
      to: email,
      subject: '文章审核通过提醒',
      attachment: [
        {
          data:
            process.env.EMAIL_SUCCEED_TEMPLATE?.replaceAll('{{time}}', ` ${createTime || 'unknown'} `)?.replaceAll(
              '{{title}}',
              `《${link}》`
            ) || '',
          alternative: true
        }
      ]
    }).then((result) => {
      console.log(result.error || result.message);
    });
  }

  // TODO: 上线并通知
});

export default handler;
