import { JSONFileSync, LowSync } from 'lowdb';
import { resolve } from 'path';
import appConfig from '../config/app-config.json';

export enum FileStatusType {
  REVIEWED = 'REVIEWED',
  REJECTED = 'REJECTED',
  UPLOADED = 'UPLOADED'
}

export interface Article {
  id: string;
  author: string;
  filename: string;
  originFilename: string;
  createTime: string;
  updateTime: string;
  status: FileStatusType;
  categories: string[];
  tags: string[];
}

const db = new LowSync<Article[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'article.json')));

const get = (id?: string): Article[] => {
  db.read();
  if (!db.data) {
    return [];
  }
  if (typeof id === 'string') {
    const article = db.data.find((item) => item.id === id);
    return article ? [article] : [];
  }
  return db.data;
};

const write = (article: Partial<Article>) => {
  db.read();
  if (!Array.isArray(db.data)) {
    db.data = [article as Article];
  } else {
    const current = db.data.find((item) => item.id === article.id);
    if (!current) {
      db.data.push(article as Article);
    } else {
      Object.assign(current, article);
    }
  }
  db.write();
};

const articleUtil = { get, write };

export default articleUtil;
