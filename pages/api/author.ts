// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Author, AuthorResponseData } from '../../types';
import { authorDB } from '../../utils/server/db';

export const getAuthor = (id?: string): Author[] => {
  authorDB.read();
  if (!authorDB.data) {
    return [];
  }
  if (typeof id === 'string') {
    const author = authorDB.data.find((item) => item.id === id);
    return author ? [author] : [];
  }
  return authorDB.data;
};

export const writeAuthor = (author: Partial<Author>) => {
  authorDB.read();
  if (!Array.isArray(authorDB.data)) {
    authorDB.data = [author as Author];
  } else {
    const current = authorDB.data.find((item) => item.id === author.id);
    if (!current) {
      authorDB.data.unshift(author as Author);
    } else {
      Object.assign(current, author);
    }
  }
  authorDB.write();
};

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<AuthorResponseData>) {
    res.status(501).json({ message: error.message });
  }
});

handler.get((req: NextApiRequest, res: NextApiResponse<AuthorResponseData>) => {
  res.status(200).json({ authors: getAuthor(req.query.id as string) });
});

export default handler;
