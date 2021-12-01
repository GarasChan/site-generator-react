import React, { ReactElement, useState } from 'react';
import { Steps } from '@arco-design/web-react';
import Main from '../../components/main';
import Upload from '../../components/submit/upload';
import Editor from '../../components/submit/editor';
import { ResponseData } from '../api/upload';
import 'md-editor-rt/lib/style.css';

const { Step } = Steps;

// https://github.com/imzbf/md-editor-rt
const Submit = () => {
  const step = useState(1);
  const [data, setData] = useState<ResponseData>({} as ResponseData);

  const updateContent = (val: string) => {
    setData((d) => ({ ...d, content: val }));
  };

  return (
    <>
      <Upload setData={setData} />
      {data?.content && <Editor value={data.content} updateContent={updateContent} />}
    </>
  );
};

Submit.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Submit;
