import { Button, List, Result, Skeleton } from '@arco-design/web-react';
import React, { ReactElement } from 'react';
import Main from '../../../components/layout/main';
import { MainCenter } from '../../../components/layout/main-center';
import useRequest from '../../../hooks/useRequest';
import { ArticleResponseData } from '../../../types';
import ReviewItem from '../../../components/review/ReviewItem';
import ArticleContent from '../../../components/article-content';
import { asyncRunSafe, getArticle } from '../../../utils';
import request from '../../../utils/request';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Review = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const { error, data, loading, retry } = useRequest<ArticleResponseData>({ url: '/article', params: {id: } });
  console.log(data);
  return (
    <MainCenter>
      <ArticleContent content={`<h1>赵钟倩</h1>`} />
    </MainCenter>
  );
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.params || {};
  if (!id) {
    return {
      notFound: true
    };
  }

  const data = getArticle(id as string);

  // console.log('data', data);

  return {
    props: {
      data
    }
  };
};

export default Review;
