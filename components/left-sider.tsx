import { ReactElement, useContext } from 'react';
import { Layout } from 'antd';
import { ConfigProvider } from 'antd';

export default function LeftSider({ children }: { children: ReactElement }) {
    return <Layout.Sider className="left-sider" theme='light'>{children}</Layout.Sider>;
}
