import React, { ReactElement, useState } from 'react';
import { Tabs, Steps } from '@arco-design/web-react';
import Main from '../../components/layout/main';
import Upload from '../../components/submit/upload';
import Editor from '../../components/submit/editor';
import { UploadResponseData } from '../api/upload';
import Info from '../../components/submit/info';
import 'md-editor-rt/lib/style.css';

const { TabPane } = Tabs;
const { Step } = Steps;

const Submit = () => {
  const [data, setData] = useState<UploadResponseData | undefined>();
  const [current, setCurrent] = useState<number>(1);

  const updateContent = (val: string) => {
    setData((d) => ({ ...d!, content: val }));
  };

  const updateCurrent = (val: number) => {
    if (!data) {
      return;
    }
    setCurrent(val);
  };

  const renderContent = () => {
    if (current === 1 || !data) {
      return <Upload setData={setData} />;
    }
    if (current === 2) {
      return <Editor value={data.content} updateContent={updateContent} />;
    }
    if (current === 3) {
      return <Info value={data.data} />;
    }
    return '提交成功';
  };

  return (
    <>
      <Steps type="arrow" size="small" current={current} onChange={updateCurrent} style={{ marginBottom: 24 }}>
        <Step title="上传文件" disabled={current === 4} />
        <Step title="确认内容" disabled={!data || current === 4} />
        <Step title="修改信息" disabled={!data || current === 4} />
        <Step title="提交审核" disabled />
      </Steps>
      <Upload setData={setData} hide={current !== 1} />
      {data && (
        <>
          <Editor value={data.content} updateContent={updateContent} hide={current !== 2} />
          <Info value={data.data} hide={current !== 3} />
          {current === 4 && <div>提交成功</div>}
        </>
      )}
      {/* {renderContent()} */}
      {/* {data && (
        <Tabs style={{ marginTop: 24 }}>
          <TabPane key="docs" title="文档内容">
            {data.content && <Editor value={data.content} updateContent={updateContent} />}
          </TabPane>
          <TabPane key="info" title="文档信息">
            <Info value={data.data} />
          </TabPane>
        </Tabs>
      )} */}
    </>
  );
};

Submit.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Submit;
