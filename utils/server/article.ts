const fs = require('fs');
import { JSONFileSync, LowSync } from 'lowdb';
import { Article } from '../../types';
import matter from 'gray-matter';
import { resolvePath } from '.';
import { remark } from 'remark';
import html from 'remark-html';

// TODO: 用 marked 解析 markdown

export interface ArticleData extends Article {
  file: string;
}

const db = new LowSync<Article[]>(new JSONFileSync(resolvePath(['db', 'article.json'])));

export const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(html).process(markdown);
  return result.toString();
};

export const getArticle = async (id: string): Promise<ArticleData | null> => {
  db.read();
  if (!db.data) {
    return null;
  }
  const article = db.data.find((item) => item.id === id);
  if (!article) {
    return null;
  }
  const { filename } = article;

  const file = fs.readFileSync(resolvePath([process.env.ARTICLE_PATH!, filename]), { encoding: 'utf-8' });
  const { content } = matter(file);
  const htmlContent = await markdownToHtml(content);

  return {
    ...article,
    file: htmlContent
  };
};

export const getArticleLink = (id: string, title?: string, origin?: string) => {
  const name = title || 'unknown';
  return origin ? `<a href=${origin}/article/${id} target='_blank'>${name}</a>` : name;
};
