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

const formatMessage = ({ createTime, title, reason }: { createTime: string; title: string; reason: string }) => {
  const reasonStr = `\n<ul>${reason
    .split('\n')
    .filter((item: string) => item.trim())
    .map((item: string) => `<li>${item.trim()}</li>`)
    .join('')}</ul>\n`;
  // console.log(
  //   process.env.EMAIL_REJECTED_TEMPLATE?.split('{{reason}}').filter(item => item.trim()).forEach(item => {

  //   })
  //     ?.split('\n')
  //     .filter((item) => item.trim())
  //     .map((item) =>
  //       item.includes('{{reason}}')
  //         ? item.replaceAll('{{reason}}', reasonStr)
  //         : `<p>${item
  //             ?.trim()
  //             ?.replaceAll('{{time}}', ` ${createTime || 'unknown'} `)
  //             ?.replaceAll('{{title}}', title ? `《${title}》` : ' unknown ')}</p>`
  //     )
  //     .join('')
  // );
  console.log('1', process.env.EMAIL_REJECTED_TEMPLATE?.replace(/\{\{reason\}\}/, reasonStr));
  console.log('2', process.env.EMAIL_REJECTED_TEMPLATE?.replace(/\{\{reason\}\}/, reasonStr)?.split('\\n'));
  console.log(
    '3',
    process.env.EMAIL_REJECTED_TEMPLATE?.replace(/\{\{reason\}\}/, reasonStr)
      ?.split('\\n')
      .filter((item) => item.trim())
  );
  return process.env.EMAIL_REJECTED_TEMPLATE?.replace(/\{\{reason\}\}/, reasonStr)
    ?.split('\\n')
    .filter((item) => item.trim())
    .map(
      (item) =>
        `<p>${item
          ?.trim()
          ?.replaceAll('{{time}}', ` ${createTime || 'unknown'} `)
          ?.replaceAll('{{title}}', title ? `《${title}》` : ' unknown ')}</p>`
    )
    .join('');
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ArticleAgreeResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<ArticleAgreeResponseData>) => {
  const { id } = req.query;
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
          data: formatMessage({ createTime, title, reason }),
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
