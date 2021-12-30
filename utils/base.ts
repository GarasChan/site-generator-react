import { resolve } from 'path';

export function resolvePath(relativePath: string[] | string, basePath = process.cwd()) {
  const paths = Array.isArray(relativePath) ? relativePath : [relativePath];
  return resolve(basePath, ...paths);
}

export async function asyncRunSafe<T = any>(fn: Promise<T>): Promise<[any] | [null, T]> {
  try {
    const result = await fn;
    return [null, result];
  } catch (e) {
    return [e];
  }
}
