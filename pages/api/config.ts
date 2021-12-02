// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export interface ConfigResponseData {
  categories: string[];
  tags: string[];
}

// 分类
const categories = ['工具', '数据', '教程', '资源'];
// 标签
const tags = ['遥感数据', 'GIS 数据', '卫星数据', '学科数据'];

export default function handler(_: NextApiRequest, res: NextApiResponse<ConfigResponseData>) {
  res.status(200).json({ categories, tags });
}
