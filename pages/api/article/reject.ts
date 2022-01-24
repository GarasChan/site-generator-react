import { getArticleLink } from './../../../utils/server/article';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Article, ArticleAgreeResponseData, ArticleStatus } from '../../../types';
import { sendEmail } from '../../../utils/server';
import { getAuthor } from '../author';
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

const formatMessage = ({ createTime, title, reason }: { createTime: string; title: string; reason: string }) => {
  const reasonStr = `\\n<ul>${reason
    .split('\n')
    .filter((item: string) => item.trim())
    .map((item: string) => `<li>${item.trim()}</li>`)
    .join('')}</ul>\\n`;
  const message = process.env.EMAIL_REJECTED_TEMPLATE?.replace(/\{\{reason\}\}/, reasonStr)
    ?.split('\\n')
    .filter((item) => item.trim())
    .map(
      (item) =>
        `<p>${item
          ?.trim()
          ?.replaceAll('{{time}}', ` ${createTime || 'unknown'} `)
          ?.replaceAll('{{title}}', `《${title}》`)}</p>`
    );
  message?.push('<p>请勿直接回复该邮件。</p>');
  return message?.join('');
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleAgreeResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleAgreeResponseData>) => {
  const id = req.query.id as string;
  const { reason } = req.body;

  if (!id) {
    res.status(400).json({ message: '请求参数异常' });
    return;
  }

  const { success, message, articles } = update({ id: id as string, status: ArticleStatus.REJECTED });

  if (!success || !articles) {
    res.status(404).json({ message });
    return;
  }

  // 发送邮件通知
  const { author, title, createTime } = articles?.[0];
  const { email } = getAuthor(author)[0];
  console.log('reason', reason);
  console.log('process.env.EMAIL_REJECTED_TEMPLATE', process.env.EMAIL_REJECTED_TEMPLATE);
  if (email) {
    sendEmail({
      to: email,
      subject: '文章退回提醒',
      attachment: [
        {
          data: formatMessage({ createTime, title: getArticleLink(id, title, req.headers.origin), reason }),
          alternative: true
        }
      ]
    }).then((result) => {
      console.log(result.error || result.message);
    });
  }

  res.status(200).json({ articles });
});

export default handler;
