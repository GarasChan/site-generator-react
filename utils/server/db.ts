import { JSONFileSync, LowSync } from 'lowdb';
import { Article, Author } from '../../types';
import { resolvePath } from './base';

export const articleDB = new LowSync<Article[]>(new JSONFileSync(resolvePath(['db', 'article.json'])));
export const authorDB = new LowSync<Author[]>(new JSONFileSync(resolvePath(['db', 'author.json'])));
export const categoryDB = new LowSync<string[]>(new JSONFileSync(resolvePath(['db', 'category.json'])));
export const tagDB = new LowSync<string[]>(new JSONFileSync(resolvePath(['db', 'tag.json'])));
