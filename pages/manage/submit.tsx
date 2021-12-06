import React, { ReactElement, useCallback, useState } from 'react';
import { Steps } from '@arco-design/web-react';
import SubmitContext, { DEFAULT_SUBMIT_DATA, SubmitContextData, SubmitData } from '../../components/submit/context';
import Main from '../../components/layout/main';
import Upload from '../../components/submit/upload';
import Editor from '../../components/submit/editor';
import Meta from '../../components/submit/meta';
import Result from '../../components/submit/result';

const { Step } = Steps;

const Submit = () => {
  const [data, setData] = useState<SubmitContextData['data']>(DEFAULT_SUBMIT_DATA);
  const [current, setCurrent] = useState<number>(1);

  const goNext = useCallback(() => {
    setCurrent((step) => step + 1);
  }, []);

  const goBack = useCallback(() => {
    setCurrent((step) => step - 1);
  }, []);

  const updateData = useCallback((val: SubmitData) => {
    setData(val);
  }, []);

  return (
    <SubmitContext.Provider value={{ data, updateData, goBack, goNext }}>
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
            <Result hide={current !== 4} />
          </>
        )}
      </div>
    </SubmitContext.Provider>
  );
};

Submit.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Submit;
