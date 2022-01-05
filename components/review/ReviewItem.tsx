import React, { useState } from 'react';
import { Avatar, Grid, Message, Space, Tag, Tooltip, Button, Typography } from '@arco-design/web-react';
import { IconCalendarClock, IconHistory } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import { Article, ArticleStatus } from '../../types';
import style from './index.module.less';
import request, { asyncRunSafe } from '../../utils/request';
import Link from 'next/link';
import Image from 'next/image';
import WaveLink from '../wave-link';
import { getCover } from '../../utils/client';

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
    { id, cover, filename, title, status, categories, tags, createTime, updateTime } = article;

  const [actionLoading, setActionLoading] = useState(false);

  const renderDesc = (desc: string, tags?: string[]) => {
    if (!tags?.length) {
      return null;
    }
    return (
      <Space style={{ marginTop: 8 }}>
        {tags.map((t, i) => (
          <Tooltip key={t + i} content={`标签：${t}`}>
            <Tag size="small">{t}</Tag>
          </Tooltip>
        ))}
      </Space>
    );
  };

  const handleAgree = async (id: string) => {
    const [err, result] = await asyncRunSafe(request.post(`/article/agree?id=${id}`));
  };

  return (
    <Row className={style.item} gutter={[0, -24]}>
      <Col className={style.cover} span={4}>
        <Avatar shape="square" style={{ width: '100%', height: '100%' }}>
          {/* <Image src={cover} alt="Cover Image" /> */}
          <img src={getCover(cover)} alt="Cover Image" />
        </Avatar>
      </Col>
      <Col className={style.main} span={18}>
        <div className={style.header}>
          <Link href={`/manage/review/${id}`} passHref>
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
                  <IconCalendarClock style={{ marginRight: 4, color: 'dodgerblue' }} />
                  {createTime}
                </span>
              </Tooltip>
            )}
            {updateTime && (
              <Tooltip content="最近更新时间">
                <span>
                  <IconHistory style={{ marginRight: 4, color: 'cadetblue' }} />
                  {updateTime}
                </span>
              </Tooltip>
            )}
          </Space>
        </div>
      </Col>
      <Col className={style.action} span={2}>
        <Space direction="vertical">
          <Button size="small" type="text" status="danger">
            退回
          </Button>
          <Button
            size="small"
            type="text"
            status="success"
            onClick={(e: Event) => {
              e.stopPropagation();
              // statsUtil.write(filename, {});
              Message.success('审批成功');
              refresh();
            }}
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
