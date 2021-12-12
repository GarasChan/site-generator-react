import React, { useCallback, useContext, useState } from 'react';
import { v4 } from 'uuid';
import { Upload as ArcoUpload, Message, Modal, Button, Spin } from '@arco-design/web-react';
import classNames from 'classnames';
import SubmitContext from './context';
import { RequestOptions } from '@arco-design/web-react/es/Upload/interface';
import matter from 'gray-matter';

export interface UploadProps {
  hide?: boolean;
}

const Upload = (props: UploadProps) => {
  const { data, go, updateData } = useContext(SubmitContext);
  const { hide } = props;
  const [loading, setLoading] = useState(false);

  const handleNext = useCallback(() => {
    go(2);
  }, [go]);

  const handleNew = useCallback(() => {
    updateData({
      id: v4(),
      filename: `${v4()}.md`,
      data: { title: '自定义文档' },
      content: '# 自定义文档\n\n在这里编写文档'
    });
  }, [updateData]);

  const handleRemove = useCallback(
    () =>
      new Promise((resolve, reject) => {
        Modal.confirm({
          title: '确认删除文件',
          content: '删除文件会导致对当前文档的变更丢失，是否继续？',
          okText: '继续',
          onOk: () => {
            updateData(null);
            resolve(true);
          },
          onCancel: () => reject('cancel')
        });
      }),
    [updateData]
  );

  const request = useCallback(
    (options: RequestOptions) => {
      const { file, onError, onSuccess } = options;
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (!result || typeof result !== 'string') {
          onError();
          return;
        }
        const { content, data } = matter(result);
        updateData({ id: v4(), content, data, filename: file.name });
        onSuccess();
      };
      reader.onerror = () => {
        updateData(null);
        onError();
      };
      reader.onloadend = () => {
        setLoading(false);
      };
      reader.readAsText(file, 'utf-8');
    },
    [updateData]
  );

  return (
    <div className={classNames({ hidden: hide })}>
      <Spin loading={loading} style={{ display: 'block' }}>
        <ArcoUpload
          drag
          tip="仅支持 markdown 文件（*.md）"
          limit={1}
          fileList={data ? [{ uid: data.id, name: data.filename }] : []}
          customRequest={request}
          beforeUpload={(file) => {
            if (!/.+\.md$/i.test(file.name)) {
              Message.info('不支持的文件格式');
              return false;
            }
            return true;
          }}
          onRemove={handleRemove}
        />
      </Spin>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {data ? (
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
