import React from 'react';
import { Button, Form, Input, Select } from '@arco-design/web-react';
import { ConfigResponseData } from '../../pages/api/config';
import useSWR from 'swr';
import classNames from 'classnames';

const { Item } = Form;

export interface InfoProps {
  value: {
    title?: string;
  };
  hide?: boolean;
}

const Info = (props: InfoProps) => {
  const { value, hide } = props;
  const { data = {} as ConfigResponseData } = useSWR<ConfigResponseData>('/api/config', (url: string) =>
    fetch(url).then((res) => res.json())
  );
  const { categories = [], tags = [] } = data;

  return (
    <Form
      className={classNames({ hidden: hide })}
      style={{ maxWidth: 800, margin: 'auto' }}
      labelAlign="left"
      labelCol={{ span: 2, offset: 0 }}
      wrapperCol={{ span: 22, offset: 0 }}
      initialValues={value}
    >
      <Item label="标题" field="title">
        <Input />
      </Item>
      <Item label="分类" field="categories">
        <Select mode="multiple" options={categories.map((item: string) => ({ label: item, value: item }))} />
      </Item>
      <Item label="标签" field="tags">
        <Select mode="multiple" options={tags.map((item: string) => ({ label: item, value: item }))} />
      </Item>
      <Item label="作者" field="tags">
        <Select mode="multiple" options={tags.map((item: string) => ({ label: item, value: item }))} />
      </Item>
      <Button type="primary">提交</Button>
    </Form>
  );
};

export const getStaticProps = async () => {
  const res = await fetch('/api/config');
  const config: ConfigResponseData = await res.json();

  return {
    props: {
      config
    }
  };
};

export default Info;
