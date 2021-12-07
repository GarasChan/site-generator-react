import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Space } from '@arco-design/web-react';
import styles from '../styles/home.module.less';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Site generator react</title>
        <meta name="description" content="静态页面生成器 -- React" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Space>
          <Link href="/manage/submit" passHref>
            <Button>上传</Button>
          </Link>
          <Link href="/manage/review" passHref>
            <Button>审核</Button>
          </Link>
        </Space>
      </main>
    </div>
  );
};

export default Home;
