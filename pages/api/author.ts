// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { resolve } from 'path';
import { LowSync, JSONFileSync } from 'lowdb';
import appConfig from '../../config/app-config.json';

export interface Author {
  name: string;
  descImg: string;
}

const db = new LowSync<Author[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'author.json')));
db.read();
if (!db.data) {
  db.data ||= [];
  db.write();
}

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<{ success: boolean; message: string }>) {
    res.status(501).json({ success: false, message: error.message });
  }
});

handler.get((req: NextApiRequest, res: NextApiResponse<Author[]>) => {
  const { query } = req;
  const { name } = query;
  if (name !== undefined) {
    const user = db.data?.find((d: Author) => d.name === name);
    res.status(200).json(user ? [user] : []);
    return;
  }
  res.status(200).json(db.data!);
});

export default handler;
