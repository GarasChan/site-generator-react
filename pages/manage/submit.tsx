import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Steps } from '@arco-design/web-react';
import SubmitContext, { SubmitData } from '../../components/submit/context';
import Main from '../../components/layout/main';
import Upload from '../../components/submit/upload';
import Editor from '../../components/submit/editor';
import Meta from '../../components/submit/meta';
import Result from '../../components/submit/result';
import { MainCenter } from '../../components/layout/main-center';
import { GetServerSideProps } from 'next';
import { getArticle } from '../../utils/server';
import { Article } from '../../types';

const { Step } = Steps;

const getSubmitDataFromArticle = (article: Article) => {
  if (!article) {
    return null;
  }
  return {
    id: article.id,
    meta: {
      author: article.author,
      title: article.title,
      categories: article.categories,
      tags: article.tags,
      cover: article.cover
    },
    content: article.content || '',
    filename: article.originFilename
  };
};

const Submit = ({ article }: { article: Article }) => {
  const [data, setData] = useState<SubmitData | null>(getSubmitDataFromArticle(article));
  const [current, setCurrent] = useState<number>(article ? 2 : 1);

  const isModify = !!article;

  const go = useCallback((step: number) => {
    setCurrent(step);
  }, []);

  const updateData = useCallback((val: SubmitData | null) => {
    setData(val);
  }, []);

  useEffect(() => {
    window.onbeforeunload = function (e) {
      e = e || window.event;
      if (e) {
        e.returnValue = '系统可能不会保存您所做的更改。';
      }
      return '系统可能不会保存您所做的更改。';
    };
  }, []);

  return (
    <SubmitContext.Provider value={{ data, updateData, go, isModify }}>
      <MainCenter>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <Steps type="arrow" size="small" current={current} style={{ marginBottom: 24 }}>
            <Step title="上传文件" />
            <Step title="文档正文" />
            <Step title="文档信息" />
            <Step title="提交审核" />
          </Steps>
          {!isModify && <Upload hide={current !== 1} />}
          {data && (
            <>
              <Editor hide={current !== 2} />
              <Meta hide={current !== 3} />
            </>
          )}
          {current === 4 && <Result />}
        </div>
      </MainCenter>
    </SubmitContext.Provider>
  );
};

Submit.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Submit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { article_id } = context.query;

  if (!article_id) {
    return { props: { article: null } };
  }

  const article = await getArticle(article_id as string, { returnContent: true });

  if (!article) {
    return {
      notFound: true
    };
  }

  return {
    props: { article } // will be passed to the page component as props
  };
};
