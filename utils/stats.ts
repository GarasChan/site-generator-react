import fs from 'fs';
import { resolve } from 'path';
import appConfig from '../config/app-config.json';

export enum FileStatusType {
  REVIEWED = 'REVIEWED',
  REJECTED = 'REJECTED',
  UPLOADED = 'UPLOADED'
}

export interface FileInfo {
  author: string;
  filename: string;
  originFilename: string;
  createTime: string;
  updateTime: string;
  status: FileStatusType;
  categories: string[];
  tags: string[];
}

const { storeDirName, storeStatsName } = appConfig;
const statsPath = resolve(process.cwd(), storeDirName, `${storeStatsName}.json`);

function getStats(): FileInfo[] {
  const stats = fs.readFileSync(statsPath, { encoding: 'utf-8' });
  try {
    return JSON.parse(stats);
  } catch (error) {
    return [];
  }
}

function writeStats(filename: string, fileInfo: Partial<FileInfo>) {
  const stats = getStats();
  const index = stats.findIndex((stat) => stat.filename === filename);
  if (index > -1) {
    Object.assign(stats[index], fileInfo);
  } else {
    stats.push(fileInfo as FileInfo);
  }

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
}

const statsUtil = {
  get: getStats,
  write: writeStats
};

export default statsUtil;
