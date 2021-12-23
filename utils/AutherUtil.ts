import { JSONFileSync, LowSync } from 'lowdb';
import { resolve } from 'path';
import appConfig from '../config/app-config.json';

export interface Author {
  id: string;
  name: string;
  descImg: string;
}

const db = new LowSync<Author[]>(new JSONFileSync(resolve(process.cwd(), appConfig.dbPath, 'author.json')));

const get = (id?: string): Author[] => {
  db.read();
  if (!db.data) {
    return [];
  }
  if (typeof id === 'string') {
    const author = db.data.find((item) => item.id === id);
    return author ? [author] : [];
  }
  return db.data;
};

const write = (author: Partial<Author>) => {
  db.read();
  if (!Array.isArray(db.data)) {
    db.data = [author as Author];
  } else {
    const current = db.data.find((item) => item.id === author.id);
    if (!current) {
      db.data.push(author as Author);
    } else {
      Object.assign(current, author);
    }
  }
  db.write();
};

const authorUtil = { get, write };

export default authorUtil;
