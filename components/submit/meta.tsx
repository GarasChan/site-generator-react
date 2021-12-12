import React, { useCallback, useContext } from 'react';
import { Button, Form, Input, Select } from '@arco-design/web-react';
import { ConfigResponseData } from '../../pages/api/config';
import classNames from 'classnames';
import { IconLeft, IconRight } from '@arco-design/web-react/icon';
import SubmitContext from './context';
import useRequest from '../../hooks/useRequest';

const { Item } = Form;

export interface MetaProps {
  hide?: boolean;
}

const Meta = (props: MetaProps) => {
  const { data, go, updateData } = useContext(SubmitContext);
  const { hide } = props;
  const result = useRequest<ConfigResponseData>({ url: '/api/config' });
  const { categories = [], tags = [] } = result.data || {};

  const handleSubmit = useCallback(
    (values: any) => {
      updateData({ ...data!, data: values });
      go(4);
    },
    [data, go, updateData]
  );

  return (
    <Form
      className={classNames({ hidden: hide })}
      style={{ maxWidth: 600, margin: 'auto' }}
      layout="vertical"
      requiredSymbol={{ position: 'end' }}
      initialValues={data?.data}
      onSubmit={handleSubmit}
    >
      <Item
        label="标题"
        field="title"
        rules={[
          {
            required: true,
            message: '请输入标题'
          }
        ]}
      >
        <Input />
      </Item>
      <Item
        label="分类"
        field="categories"
        rules={[
          {
            required: true,
            message: '请选择分类'
          }
        ]}
      >
        <Select mode="multiple" options={categories.map((item: string) => ({ label: item, value: item }))} />
      </Item>
      <Item
        label="标签"
        field="tags"
        rules={[
          {
            required: true,
            message: '请选择标签'
          }
        ]}
      >
        <Select mode="multiple" options={tags.map((item: string) => ({ label: item, value: item }))} />
      </Item>
      <Item>
        <div style={{ display: 'flex', marginTop: 24 }}>
          <Button
            onClick={() => {
              go(2);
            }}
          >
            <IconLeft />
            <span>上一步</span>
          </Button>
          <Button style={{ marginLeft: 'auto' }} type="primary" htmlType="submit">
            <span>下一步</span>
            <IconRight />
          </Button>
        </div>
      </Item>
    </Form>
  );
};

export default Meta;
