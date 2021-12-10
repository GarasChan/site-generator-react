import React, { ReactElement, ReactNode } from 'react';
import { Layout } from '@arco-design/web-react';
import style from './index.module.less';

export default function Content({ children }: { children: ReactNode }) {
  return <Layout.Content className={style.content}>{children}</Layout.Content>;
}
