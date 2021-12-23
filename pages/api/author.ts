// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import authorUtil, { Author } from '../../utils/AutherUtil';

export interface AuthorResponse {
  success: boolean;
  data: Author[] | string;
}

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<AuthorResponse>) {
    res.status(501).json({ success: false, data: error.message });
  }
});

handler.get((req: NextApiRequest, res: NextApiResponse<AuthorResponse>) => {
  res.status(200).json({ success: true, data: authorUtil.get(req.query.id as string) });
});

export default handler;
