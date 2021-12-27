// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { JSONFileSync, LowSync } from 'lowdb';
import { resolve } from 'path';
import appConfig from '../../config/app-config.json';

export interface Author {
  id: string;
  name: string;
  descImg: string;
}
export interface AuthorResponseData {
  data: Author[];
}

export interface AuthorResponseError {
  error?: any;
  message?: string;
}

const db = new LowSync<Author[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'author.json')));

export const getAuthor = (id?: string): Author[] => {
  db.read();
  if (!db.data) {
    return [];
  }
  if (typeof id === 'string') {
    const author = db.data.find((item) => item.id === id);
    return author ? [author] : [];
  }
  return db.data;
};

export const writeAuthor = (author: Partial<Author>) => {
  db.read();
  if (!Array.isArray(db.data)) {
    db.data = [author as Author];
  } else {
    const current = db.data.find((item) => item.id === author.id);
    if (!current) {
      db.data.push(author as Author);
    } else {
      Object.assign(current, author);
    }
  }
  db.write();
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<AuthorResponseError>) {
    res.status(501).json({ error, message: error.message });
  }
});

handler.get((req: NextApiRequest, res: NextApiResponse<AuthorResponseData>) => {
  res.status(200).json({ data: getAuthor(req.query.id as string) });
});

export default handler;
