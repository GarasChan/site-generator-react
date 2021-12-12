import fs from 'fs';
import { resolve } from 'path';
import appConfig from '../config/app-config.json';

export enum FileStatusType {
  REVIEWED = 'REVIEWED',
  REJECTED = 'REJECTED',
  UPLOADED = 'UPLOADED'
}

export interface FileInfo {
  originFilename: string;
  createTime: string;
  updateTime: string;
  status: FileStatusType;
  categories: string[];
  tags: string[];
}

const { storeDirName, storeStatsName } = appConfig;
const statsPath = resolve(process.cwd(), storeDirName, `${storeStatsName}.json`);

function getStats(): Record<string, FileInfo> {
  const stats = fs.readFileSync(statsPath, { encoding: 'utf-8' });
  try {
    return JSON.parse(stats);
  } catch (error) {
    return {};
  }
}

function writeStats(filename: string, fileInfo: Partial<FileInfo>) {
  const statsJson = getStats();
  const current = statsJson[filename] ?? {};
  if (current) {
    // 兼容手动书写 md 的情况
    const { updateTime } = fileInfo;
    if (!current.createTime && updateTime) {
      current.createTime = updateTime;
    }
  }
  Object.assign(current, fileInfo);
  statsJson[filename] = current;
  fs.writeFileSync(statsPath, JSON.stringify(statsJson, null, 2));
}

const statsUtil = {
  get: getStats,
  write: writeStats
};

export default statsUtil;
