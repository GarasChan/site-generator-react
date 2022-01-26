import React, { ReactElement } from 'react';
import Main from '../../components/layout/main';
import { MainCenter } from '../../components/layout/main-center';
import ArticleContent from '../../components/article-content';
import { getArticle } from '../../utils/server';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { Article } from '../../types';

export interface ReviewProps {
  data: Article;
}

const Review = ({ data }: ReviewProps) => {
  const { title, html } = data;

  return (
    <MainCenter>
      <Head>
        <title>{title}</title>
      </Head>
      {html && <ArticleContent content={html} />}
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

  const data = await getArticle(id as string, { returnHTML: true });

  if (!data) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      data
    }
  };
};

export default Review;
