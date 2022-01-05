// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { JSONFileSync, LowSync } from 'lowdb';
import nextConnect from 'next-connect';
import { ConfigResponseData } from '../../types';
import { resolvePath } from '../../utils/server';

const tagDb = new LowSync<string[]>(new JSONFileSync(resolvePath([process.env.DB_PATH!, 'tag.json'])));
const categoryDb = new LowSync<string[]>(new JSONFileSync(resolvePath([process.env.DB_PATH!, 'category.json'])));

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ConfigResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.get((_: NextApiRequest, res: NextApiResponse<ConfigResponseData>) => {
  tagDb.read();
  categoryDb.read();
  const tags = tagDb.data ? tagDb.data : [];
  const categories = categoryDb.data ? categoryDb.data : [];
  res.status(200).json({ config: { tags, categories } });
});

export default handler;
