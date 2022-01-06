import { resolve } from 'path';

export function resolvePath(relativePath: string[] | string, basePath = process.cwd()) {
  const paths = Array.isArray(relativePath) ? relativePath : [relativePath];
  return resolve(basePath, ...paths);
}
