import type { ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';
import styles from './index.module.less';

export default function Main({ children }: { children: ReactElement }) {
    return <Layout className={styles.main}>{children}</Layout>;
}
