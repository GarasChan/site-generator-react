import React, { Dispatch, SetStateAction, useState } from 'react';
import { Upload as ArcoUpload, Message, Modal } from '@arco-design/web-react';
import { UploadResponseData } from '../../pages/api/upload';
import classNames from 'classnames';

export interface UploadProps {
  setData: Dispatch<SetStateAction<UploadResponseData | undefined>>;
  hide?: boolean;
}

const Upload = (props: UploadProps) => {
  const { setData, hide } = props;

  return (
    <div className={classNames({ hidden: hide })}>
      <ArcoUpload
        drag
        tip="仅支持 markdown 文件（.md）"
        action="/api/upload"
        limit={1}
        beforeUpload={(file) => {
          if (!/.+\.md$/i.test(file.name)) {
            Message.info('不支持的文件格式');
            return false;
          }
          return true;
        }}
        onRemove={() =>
          new Promise((resolve, reject) => {
            Modal.confirm({
              title: '确认删除文件',
              content: '删除文件会导致对当前文档的变更丢失，是否继续？',
              okText: '继续',
              onOk: () => resolve(true),
              onCancel: () => reject('cancel')
            });
          })
        }
        onChange={(files) => {
          setData(files[0]?.response as UploadResponseData);
        }}
      />
    </div>
  );
};

export default Upload;
