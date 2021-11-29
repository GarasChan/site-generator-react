import type { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';

export default function RightSider({ children }: { children: ReactElement }) {
    return <Layout.Sider className='right-sider' theme='light'>{children}</Layout.Sider>;
}
