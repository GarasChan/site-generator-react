import fs from 'fs';
import appConfig from '../config/app-config.json';
import { resolve } from 'path';
import { JSONFileSync, LowSync } from 'lowdb';
import { Article } from '../types';
import matter from 'gray-matter';
import { resolvePath } from './base';

export interface ArticleData extends Article {
  file: string;
}

const db = new LowSync<Article[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'article.json')));

export const getArticle = (id: string): ArticleData | null => {
  db.read();
  if (!db.data) {
    return null;
  }
  const article = db.data.find((item) => item.id === id);
  if (!article) {
    return null;
  }
  const { filename } = article;

  const file = fs.readFileSync(resolvePath([appConfig.articlePath, filename]), { encoding: 'utf-8' });
  const { content, data } = matter(file);
  console.log({ content, data });
  return {
    ...article,
    file: content
  };
};
