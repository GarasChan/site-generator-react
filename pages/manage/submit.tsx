import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Steps } from '@arco-design/web-react';
import SubmitContext, { SubmitData } from '../../components/submit/context';
import Main from '../../components/layout/main';
import Upload from '../../components/submit/upload';
import Editor from '../../components/submit/editor';
import Meta from '../../components/submit/meta';
import Result from '../../components/submit/result';
import { MainCenter } from '../../components/layout/main-center';

const { Step } = Steps;

const Submit = () => {
  const [data, setData] = useState<SubmitData | null>(null);
  const [current, setCurrent] = useState<number>(1);

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
        e.returnValue = '关闭提示';
      }
      return '关闭提示';
    };
  }, []);

  return (
    <SubmitContext.Provider value={{ data, updateData, go }}>
      <MainCenter>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <Steps type="arrow" size="small" current={current} style={{ marginBottom: 24 }}>
            <Step title="上传文件" />
            <Step title="文档正文" />
            <Step title="文档信息" />
            <Step title="提交审核" />
          </Steps>
          <Upload hide={current !== 1} />
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
