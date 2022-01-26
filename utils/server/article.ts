const fs = require('fs');
import { JSONFileSync, LowSync } from 'lowdb';
import { Article } from '../../types';
import matter from 'gray-matter';
import { resolvePath } from '.';
import { remark } from 'remark';
import html from 'remark-html';

// TODO: 用 marked 解析 markdown

const db = new LowSync<Article[]>(new JSONFileSync(resolvePath(['db', 'article.json'])));

export const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(html).process(markdown);
  return result.toString();
};

export const getArticle = async (
  id: string,
  options: { returnHTML?: boolean; returnContent?: boolean }
): Promise<Article | null> => {
  const { returnHTML, returnContent } = options;
  db.read();
  if (!db.data) {
    return null;
  }
  const article = db.data.find((item) => item.id === id);
  if (!article) {
    return null;
  }

  const newArticle = { ...article };
  if (returnHTML || returnContent) {
    const { filename } = newArticle;
    const file = fs.readFileSync(resolvePath([process.env.ARTICLE_PATH!, filename]), { encoding: 'utf-8' });
    const { content } = matter(file);
    newArticle.content = content;
    if (returnHTML) {
      newArticle.html = await markdownToHtml(content);
    }
  }

  return newArticle;
};

export const getArticleLink = (id: string, title?: string, origin?: string) => {
  const name = title || 'unknown';
  return origin ? `<a href=${origin}/article/${id} target='_blank'>${name}</a>` : name;
};
