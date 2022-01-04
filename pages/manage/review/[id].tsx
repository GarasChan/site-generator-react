import React, { ReactElement } from 'react';
import Main from '../../../components/layout/main';
import { MainCenter } from '../../../components/layout/main-center';
import ArticleContent from '../../../components/article-content';
import { ArticleData, getArticle } from '../../../utils/article';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

export interface ReviewProps {
  data: ArticleData;
}

const Review = ({ data }: ReviewProps) => {
  return (
    <MainCenter>
      <Head>
        <title>{data.title}</title>
      </Head>
      <ArticleContent content={data.file} />
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

  const data = await getArticle(id as string);

  if (!data) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      data: data
    }
  };
};

export default Review;
