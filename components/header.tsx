import type { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';

export default function Header({ children }: { children: ReactElement }) {
  return <Layout.Header className="header">{children}</Layout.Header>;
}
