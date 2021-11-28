import type { ReactElement } from 'react';
import { Layout } from 'antd';

export default function RightSider({ children }: { children: ReactElement }) {
    return <Layout.Sider className='right-sider' theme='light'>{children}</Layout.Sider>;
}
