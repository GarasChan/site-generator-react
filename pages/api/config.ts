// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { ConfigResponseData } from '../../types';
import { categoryDB, tagDB } from '../../utils/server/db';

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ConfigResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.get((_: NextApiRequest, res: NextApiResponse<ConfigResponseData>) => {
  tagDB.read();
  categoryDB.read();
  const tags = tagDB.data ? tagDB.data : [];
  const categories = categoryDB.data ? categoryDB.data : [];
  res.status(200).json({ config: { tags, categories } });
});

export default handler;
