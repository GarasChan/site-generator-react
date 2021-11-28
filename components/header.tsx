import type { ReactElement } from 'react';
import { Layout } from 'antd';

export default function Header({ children }: { children: ReactElement }) {
    return <Layout.Header className='header'>{children}</Layout.Header>;
}
