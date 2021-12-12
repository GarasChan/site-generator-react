// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import statsUtil, { FileInfo } from '../../../utils/stats';

export type ArticleResponseData = Record<string, FileInfo>;

export default function handler(req: NextApiRequest, res: NextApiResponse<ArticleResponseData>) {
  res.status(200).json(statsUtil.get());
}
