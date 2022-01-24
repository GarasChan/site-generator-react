import React from 'react';
import {
  Avatar,
  Grid,
  Message,
  Space,
  Tag,
  Tooltip,
  Button,
  Typography,
  Modal,
  Form,
  Input
} from '@arco-design/web-react';
import { IconCalendarClock, IconHistory } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import { Article, ArticleStatus } from '../../types';
import style from './index.module.less';
import { request, asyncRunSafe, getCover } from '../../utils/client';
import Link from 'next/link';
import WaveLink from '../wave-link';
import Image from 'next/image';

const { Row, Col } = Grid;
const { Title, Paragraph, Text } = Typography;

export interface ReviewItemProps {
  article: Article;
  refresh: () => void;
}

const StatusMapping = {
  [ArticleStatus.UPLOADED]: '待审核',
  [ArticleStatus.REJECTED]: '已退回',
  [ArticleStatus.REVIEWED]: '已审核'
};

const ReviewItem = (props: ReviewItemProps) => {
  const { article, refresh } = props,
    { id, cover, title, status, categories, tags, createTime, updateTime } = article;

  const [form] = Form.useForm();

  const handleReject = async (e: Event) => {
    e.stopPropagation();
    Modal.confirm({
      title: '确认退回该文章',
      content: (
        <Form form={form} wrapperCol={{ span: 24 }}>
          <Form.Item field="reason" rules={[{ required: true, message: '请输入退回原因' }]}>
            <Input.TextArea style={{ minHeight: 150 }} placeholder="请输入退回原因，多条原因请换行输入" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const res = await form.validate();
        const [err] = await asyncRunSafe(request.post(`/article/reject?id=${id}`, res));
        if (err) {
          Message.error(err.response.data?.message);
          return;
        }
        refresh();
        Message.success('退回成功');
      }
    });
  };

  const handleAgree = async (e: Event) => {
    e.stopPropagation();
    Modal.confirm({
      title: '确认审批通过该文章',
      onOk: async () => {
        const [err, result] = await asyncRunSafe(request.post(`/article/agree?id=${id}`));
        if (err) {
          Message.error(err.response.data?.message);
          return;
        }
        refresh();
        Message.success('审批成功');
      }
    });
  };

  return (
    <Row className={style.item} gutter={[0, -24]}>
      <Col className={style.cover} span={4}>
        <Avatar shape="square" style={{ width: '100%', height: '100%' }}>
          {/* <Image src={getCover(cover)} alt="Cover Image" /> */}
          <img src={getCover(cover)} alt="Cover Image" />
        </Avatar>
      </Col>
      <Col className={style.main} span={18}>
        <div className={style.header}>
          <Link href={`/article/${id}`} passHref>
            <WaveLink className={classNames(style.title, 'ellipsis')}>{title}</WaveLink>
          </Link>
          {categories && (
            <Space style={{ marginLeft: 24, lineHeight: 1 }}>
              {categories.map((c, i) => (
                <Tooltip key={c + i} content={`类型：${c}`}>
                  <Tag size="small" color="orange">
                    {c}
                  </Tag>
                </Tooltip>
              ))}
              {tags.map((t, i) => (
                <Tooltip key={t + i} content={`标签：${t}`}>
                  <Tag size="small" color="gray">
                    {t}
                  </Tag>
                </Tooltip>
              ))}
            </Space>
          )}
        </div>
        <div className={style.content}>
          <Paragraph className={style.desc} type="secondary" ellipsis={{ rows: 4 }}>
            暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述暂无描述
          </Paragraph>
        </div>
        <div className={style.footer}>
          <Space style={{ marginTop: 8 }} size="large">
            {createTime && (
              <Tooltip content="创建时间">
                <span>
                  <IconCalendarClock style={{ marginRight: 4, color: 'dodgerblue', fontSize: 16 }} />
                  {createTime}
                </span>
              </Tooltip>
            )}
            {updateTime && (
              <Tooltip content="最近更新时间">
                <span>
                  <IconHistory style={{ marginRight: 4, color: 'cadetblue', fontSize: 16 }} />
                  {updateTime}
                </span>
              </Tooltip>
            )}
          </Space>
        </div>
      </Col>
      <Col className={style.action} span={2}>
        <Space direction="vertical">
          <Button
            size="small"
            type="text"
            status="danger"
            onClick={handleReject}
            disabled={status !== ArticleStatus.UPLOADED}
          >
            退回
          </Button>
          <Button
            size="small"
            type="text"
            status="success"
            onClick={handleAgree}
            disabled={status !== ArticleStatus.UPLOADED}
          >
            同意
          </Button>
        </Space>
      </Col>
      <div className={classNames(style.status, style[status])}>{StatusMapping[status]}</div>
    </Row>
  );
};

export default ReviewItem;
