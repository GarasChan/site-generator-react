// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<any>) {
    res.status(501).json({ message: error.message });
  }
});

handler.post((req: NextApiRequest, res: NextApiResponse<any>) => {
  console.log(req.body);
  res.status(200).end();
});

export default handler;
