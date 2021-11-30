import { Upload, Steps, Layout, Affix } from '@arco-design/web-react';
import { UploadItem } from '@arco-design/web-react/es/Upload';
import React, { ReactElement, useRef, useState } from 'react';
import Main from '../../components/main';
import MdEditor from '../../components/md-editor';
import style from '../../styles/submit.module.less';

const { Step } = Steps;

// https://github.com/uiwjs/react-md-editor
// https://github.com/imzbf/md-editor-rt
const Submit = () => {
  const step = useState(1);
  const [file, setFile] = useState<UploadItem | null>(null);

  return (
    <div className={style.submit}>
      <div>
        <Upload
          action="/api/upload"
          disabled={!!file}
          beforeUpload={(file) => /.+\.md$/i.test(file.name)}
          fileList={file ? [file] : []}
          onChange={(_, file) => {
            setFile(file);
          }}
        />
      </div>
      <div>
        <MdEditor modelValue={file?.response?.data || ''} />
      </div>
    </div>
  );
};

Submit.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Submit;
