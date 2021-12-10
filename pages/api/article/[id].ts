// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export interface ConfigResponseData {
  categories: string[];
  tags: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ConfigResponseData>) {
  const { id } = req.query;
  res.end(`Post: ${id}`);
}
