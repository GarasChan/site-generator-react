import { List, Input } from '@arco-design/web-react';
import React, { ReactElement, useState } from 'react';
import Main from '../../components/layout/main';
import { MainCenter } from '../../components/layout/main-center';
import { Article, ArticleResponseSuccess } from '../../types';
import ReviewItem from '../../components/review/ReviewItem';
import { request, asyncRunSafe } from '../../utils/client';
import { useDeepCompareEffect } from 'react-use';
import { withSessionSsr } from '../../lib/with-session';

const InputSearch = Input.Search;

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
      <div style={{ padding: '0 12px' }}>
        <InputSearch searchButton placeholder="请输入标题名称搜索" />
      </div>
      <List
        style={{ marginTop: 24 }}
        loading={loading}
        bordered={false}
        pagination={{
          total,
          pageSize: PAGE_SIZE,
          current: params.pageNumber,
          showTotal: true,
          onChange: (current) => {
            setParams({ pageNumber: current });
          }
        }}
      >
        {data.map((item: Article) => (
          <ReviewItem key={item.id} article={item} refresh={fetchData} />
        ))}
      </List>
    </MainCenter>
  );
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Review;

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req }) {
  const user = req.session.user;

  if (!user?.admin) {
    return {
      redirect: {
        destination: `/login?redirectUri=${req.headers.referer}`,
        permanent: false
      }
    };
  }

  return { props: { user } };
});
