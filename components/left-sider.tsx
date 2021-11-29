import { ReactElement, useContext } from 'react';
import { Layout } from '@arco-design/web-react';
import { ConfigProvider } from '@arco-design/web-react';

export default function LeftSider({ children }: { children: ReactElement }) {
    return <Layout.Sider className="left-sider" theme='light'>{children}</Layout.Sider>;
}
