import { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';
import style from './index.module.less';

export default function Sider({ children }: { children: ReactElement }) {
  return (
    <Layout.Sider className={style.sider} theme="light">
      {children}
    </Layout.Sider>
  );
}
