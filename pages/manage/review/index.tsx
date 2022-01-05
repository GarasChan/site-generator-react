import { Button, List, Result, Spin } from '@arco-design/web-react';
import React, { ReactElement, useEffect, useState } from 'react';
import Main from '../../../components/layout/main';
import { MainCenter } from '../../../components/layout/main-center';
import useRequest from '../../../hooks/useRequest';
import { Article, ArticleResponseSuccess } from '../../../types';
import ReviewItem from '../../../components/review/ReviewItem';
import request, { asyncRunSafe } from '../../../utils/request';
import { useDeepCompareEffect } from 'react-use';

export interface ReviewParams {
  pageNumber: number;
}

const PAGE_SIZE = 10;

const Review = () => {
  const [data, setData] = useState<Article[]>([]);
  const [total, setTotal] = useState<number>();
  const [params, setParams] = useState({ pageNumber: 1 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const { pageNumber } = params;
    setLoading(true);
    const [err, res] = await asyncRunSafe<ArticleResponseSuccess>(
      request.get('/article', { params: { pageSize: PAGE_SIZE, pageNumber } })
    );
    setTotal(res?.total ?? 0);
    setData(res?.articles ?? []);
    setLoading(false);
  };

  useDeepCompareEffect(() => {
    fetchData();
  }, [params]);

  return (
    <MainCenter>
      {/* <Result status="500" subTitle="请求失败" extra={<Button type="primary">重试</Button>} /> */}
      <List
        loading={loading}
        bordered={false}
        pagination={{
          total,
          pageSize: PAGE_SIZE,
          current: params.pageNumber,
          onChange: (current) => {
            setParams({ pageNumber: current });
          }
        }}
      >
        {data.map((item: Article) => (
          <ReviewItem key={item.id} article={item} />
        ))}
      </List>
    </MainCenter>
  );
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Review;
