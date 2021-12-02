import React, { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';
import style from './index.module.less';

export default function Content({ children }: { children: ReactElement }) {
  return <Layout.Content className={style.content}>{children}</Layout.Content>;
}
