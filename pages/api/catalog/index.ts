import fs, { statSync } from 'fs';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';

export interface ArticleResponseData {
  name: string;
  children?: ArticleResponseData[];
}

function loop(filePath: string, result: ArticleResponseData[]) {
  fs.readdirSync(filePath).forEach((file) => {
    const tempPath = resolve(filePath, file);
    const stat = statSync(tempPath);
    if (!stat.isDirectory()) {
      if (/.+\.md$/i.test(tempPath)) {
        result.push({ name: tempPath });
      }
      return;
    }
    const temp = {
      name: tempPath,
      children: []
    };
    loop(tempPath, temp.children);
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ArticleResponseData[]>) {
  const result: ArticleResponseData[] = [];
  loop(resolve(process.cwd(), 'temp'), result);

  res.status(200).json(result);
}
