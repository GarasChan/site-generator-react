import React, { ReactNode } from 'react';
import type { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';
import Header from './header';
import Content from './content';
import Footer from './footer';
import style from './index.module.less';

export default function Main({ children }: { children: ReactNode }) {
  return (
    <Layout className={style.main}>
      <Header />
      <Layout>
        <Content>{children}</Content>
      </Layout>
      {/* <Footer /> */}
    </Layout>
  );
}
