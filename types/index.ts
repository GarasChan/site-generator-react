export interface ArticleAgreeResponseSuccess {
  success: true;
}

export interface ArticleAgreeResponseError {
  success: false;
  message: string;
}

export type ArticleAgreeResponseData = ArticleAgreeResponseSuccess | ArticleAgreeResponseError;

export enum ArticleStatus {
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
  status: ArticleStatus;
  title: string;
  categories: string[];
  tags: string[];
}

export interface ArticleResponseSuccess {
  success: true;
  data: Article[];
  file?: string;
}

export interface ArticleResponseError {
  success: false;
  message: string;
}

export type ArticleResponseData = ArticleResponseSuccess | ArticleResponseError;

export interface Author {
  id: string;
  name: string;
  descImg: string;
}

export interface AuthorResponseSuccess {
  success: true;
  data: Author[];
}

export interface AuthorResponseError {
  success: false;
  message: string;
}

export type AuthorResponseData = AuthorResponseSuccess | AuthorResponseError;

export interface Config {
  tags: string[];
  categories: string[];
}

export interface ConfigResponseSuccess {
  success: true;
  data: Config;
}

export interface ConfigResponseError {
  success: false;
  message: string;
}

export type ConfigResponseData = ConfigResponseSuccess | ConfigResponseError;
