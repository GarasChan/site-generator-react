import { Button, Form, Input, Message, Typography } from '@arco-design/web-react';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import style from '../../styles/login.module.less';
import { request } from '../../utils/client';

const Login = () => {
  const router = useRouter();

  const handleSubmit = async (values: FormData) => {
    try {
      await request.post('/login', values);
      const { redirectURI } = router.query;
      router.replace(redirectURI ? (redirectURI as string) : '/');
    } catch (error) {
      Message.error('登录失败');
    }
  };

  return (
    <div className={classNames(style['login-wrapper'], 'arco-theme')} arco-theme="dark">
      <div className={style['login-container']}>
        <div className={style.header}>
          <Typography.Title>Backend</Typography.Title>
        </div>
        <Form className={style.content} layout="vertical" requiredSymbol={false} onSubmit={handleSubmit}>
          <Form.Item field="username" label="用户名" rules={[{ required: true, message: '用户名不能为空' }]}>
            <Input placeholder="请输入用户名" prefix={<IconUser />} size="large" />
          </Form.Item>
          <Form.Item field="password" label="密码" rules={[{ required: true, message: '密码不能为空' }]}>
            <Input.Password placeholder="请输入密码" prefix={<IconLock />} size="large" />
          </Form.Item>
          <Button long type="primary" size="large" htmlType="submit" className={style['login-btn']}>
            登 录
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
