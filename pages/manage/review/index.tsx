import { Button, List, Result } from '@arco-design/web-react';
import React, { ReactElement } from 'react';
import Main from '../../../components/layout/main';
import { MainCenter } from '../../../components/layout/main-center';
import useRequest from '../../../hooks/useRequest';
import { Article, ArticleResponseData } from '../../../types';
import ReviewItem from '../../../components/review/ReviewItem';

const Review = () => {
  const { error, data, loading, retry } = useRequest<ArticleResponseData>({ url: '/article' });

  return (
    <MainCenter>
      {error || !data?.success ? (
        <Result status="500" subTitle="请求失败" extra={<Button type="primary">重试</Button>} />
      ) : (
        <List loading={loading} bordered={false}>
          {data.data.map((item: Article) => (
            <ReviewItem key={item.id} article={item} refresh={retry} />
          ))}
        </List>
      )}
    </MainCenter>
  );
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Review;
