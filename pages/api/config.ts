// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { JSONFileSync, LowSync } from 'lowdb';
import appConfig from '../../config/app-config.json';
import { resolvePath } from '../../utils';
import nextConnect from 'next-connect';

export interface ConfigResponseData {
  tags: string[];
  categories: string[];
}

export interface ConfigResponseError {
  error?: any;
  message?: string;
}

const tagDb = new LowSync<string[]>(new JSONFileSync(resolvePath([appConfig.dbPath, 'tag.json'])));
const categoryDb = new LowSync<string[]>(new JSONFileSync(resolvePath([appConfig.dbPath, 'category.json'])));

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<ConfigResponseError>) {
    res.status(501).json({ message: error.message, error });
  }
});

handler.get((_: NextApiRequest, res: NextApiResponse<ConfigResponseData>) => {
  tagDb.read();
  categoryDb.read();
  const tags = tagDb.data ? tagDb.data : [];
  const categories = categoryDb.data ? categoryDb.data : [];
  res.status(200).json({ tags, categories });
});

export default handler;
