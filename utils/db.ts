import { JSONFileSync, LowSync } from 'lowdb';
import { resolvePath } from './server';
import { Article, Author } from '../types';
import appConfig from '../config/app-config.json';

const { dbPath } = appConfig;

export const articleDB = new LowSync<Article[]>(new JSONFileSync(resolvePath([dbPath, 'article.json'])));
export const authorDB = new LowSync<Author[]>(new JSONFileSync(resolvePath([dbPath, 'author.json'])));
export const categoryDB = new LowSync<Author[]>(new JSONFileSync(resolvePath([dbPath, 'category.json'])));
export const tagDB = new LowSync<Author[]>(new JSONFileSync(resolvePath([dbPath, 'tag.json'])));
