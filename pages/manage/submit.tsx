import { Upload, Steps, Layout, Affix } from '@arco-design/web-react';
import React, { ReactElement, useRef, useState } from 'react';
import Main from '../../components/main';
import MdEditor from '../../components/md-editor';
import style from '../../styles/submit.module.less';

const { Step } = Steps;

// https://github.com/uiwjs/react-md-editor
// https://github.com/imzbf/md-editor-rt
const Submit = () => {
  const step = useState(1);
  const file = useRef<File>();

  return (
    <div className={style.submit}>
      <div>
        <Upload action="/" />
      </div>
      <div>
        <MdEditor />
      </div>
    </div>
  );
};

Submit.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Submit;
