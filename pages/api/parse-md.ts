// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import matter from 'gray-matter';

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const str = fs.readFileSync('./hello.ts', 'utf8');
  res.write(matter(str));
  res.status(200);
  res.end();
}
