import React, { Dispatch, SetStateAction, useCallback, useContext, useState } from 'react';
import { Upload as ArcoUpload, Message, Modal, Space, Button, Tooltip } from '@arco-design/web-react';
import { UploadResponseData } from '../../pages/api/upload';
import classNames from 'classnames';
import SubmitContext, { DEFAULT_SUBMIT_DATA } from './context';

export interface UploadProps {
  hide?: boolean;
}

const Upload = (props: UploadProps) => {
  const { data, goNext, updateData } = useContext(SubmitContext);
  const { hide } = props;

  const handleNext = useCallback(() => {
    if (!data.originName) {
      Message.info('请先上传文件');
      return;
    }
    goNext();
  }, [data.originName, goNext]);

  const handleNew = useCallback(() => {
    if (!data.name) {
      updateData({ ...DEFAULT_SUBMIT_DATA, name: `${Date.now()}` });
    }
    goNext();
  }, [data.name, goNext, updateData]);

  const handleChange = useCallback(
    (files) => {
      const [file] = files;
      if (!file) {
        updateData({ ...DEFAULT_SUBMIT_DATA });
        return;
      }
      if (file?.status === 'done' && file?.response) {
        updateData(file?.response as UploadResponseData);
      }
    },
    [updateData]
  );

  const handleRemove = useCallback(
    () =>
      new Promise((resolve, reject) => {
        Modal.confirm({
          title: '确认删除文件',
          content: '删除文件会导致对当前文档的变更丢失，是否继续？',
          okText: '继续',
          onOk: () => resolve(true),
          onCancel: () => reject('cancel')
        });
      }),
    []
  );

  return (
    <div className={classNames({ hidden: hide })}>
      <ArcoUpload
        drag
        tip="仅支持 markdown 文件（*.md）"
        action="/api/upload"
        limit={1}
        beforeUpload={(file) => {
          if (!/.+\.md$/i.test(file.name)) {
            Message.info('不支持的文件格式');
            return false;
          }
          return true;
        }}
        onRemove={handleRemove}
        onChange={handleChange}
      />
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {data.originName ? (
          <Button style={{ marginLeft: 16 }} type="primary" onClick={handleNext}>
            下一步
          </Button>
        ) : (
          <Button type="text" onClick={handleNew}>
            我没有 markdown 文件，手撸文档
          </Button>
        )}
      </div>
    </div>
  );
};

export default Upload;
