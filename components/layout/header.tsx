import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';
import { IconFaceFrownFill, IconFaceSmileFill } from '@arco-design/web-react/icon';
import style from './index.module.less';

export default function Header() {
  return (
    <Layout.Header className={style.header}>
      <div>logo</div>
      <div></div>
      <div className={style.user}>
        <IconFaceFrownFill />
        {/* <IconFaceSmileFill /> */}
      </div>
    </Layout.Header>
  );
}
