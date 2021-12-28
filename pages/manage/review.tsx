import { Avatar, Button, List, Message, Space, Tag, Tooltip } from '@arco-design/web-react';
import React, { ReactElement, useCallback } from 'react';
import Main from '../../components/layout/main';
import { MainCenter } from '../../components/layout/main-center';
import { IconCalendarClock, IconHistory } from '@arco-design/web-react/icon';
import useRequest from '../../hooks/useRequest';
import style from '../../styles/review.module.less';
import { Article, ArticleResponseData, ArticleStatus } from '../../types';
import classNames from 'classnames';

const { Item } = List;

const StatusMapping = {
  [ArticleStatus.UPLOADED]: '待审核',
  [ArticleStatus.REJECTED]: '已退回',
  [ArticleStatus.REVIEWED]: '已审核'
};

const Review = () => {
  const { data, loading, retry } = useRequest<ArticleResponseData>({ url: '/article' });

  const renderTitle = useCallback((title: string, categories?: string[]) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className={style.title}>{title}</span>
        {categories && (
          <Space style={{ marginLeft: 12, lineHeight: 1 }}>
            {categories.map((c, i) => (
              <Tooltip key={c + i} content={`类型：${c}`}>
                <Tag size="small" color="orange">
                  {c}
                </Tag>
              </Tooltip>
            ))}
          </Space>
        )}
      </div>
    );
  }, []);

  const renderDesc = useCallback((desc: string, tags?: string[]) => {
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
  }, []);

  const renderItem = () => {
    if (!data?.success) {
      return null;
    }

    return data.data.map(({ filename, title, status, categories, tags, createTime, updateTime }: Article) => (
      <Item
        key={filename}
        className={style.item}
        actions={[
          <Button key="error" size="small" type="text" status="danger" disabled>
            退回
          </Button>,
          <Button
            key="success"
            size="small"
            type="text"
            status="success"
            onClick={(e: Event) => {
              e.stopPropagation();
              // statsUtil.write(filename, {});
              Message.success('审批成功');
              retry();
            }}
          >
            同意
          </Button>
        ]}
      >
        <Item.Meta
          title={renderTitle(title, categories)}
          description={renderDesc('', tags)}
          avatar={
            <Avatar shape="square" style={{ width: 64, height: 64 }}>
              md
            </Avatar>
          }
        />
        <Space style={{ marginTop: 8 }} size="large">
          {createTime && (
            <Tooltip content="创建时间">
              <span>
                <IconCalendarClock style={{ marginRight: 4 }} />
                {createTime}
              </span>
            </Tooltip>
          )}
          {updateTime && (
            <Tooltip content="最近更新时间">
              <span>
                <IconHistory style={{ marginRight: 4 }} />
                {updateTime}
              </span>
            </Tooltip>
          )}
        </Space>
        <div className={classNames(style.status, style[status])}>{StatusMapping[status]}</div>
      </Item>
    ));
  };

  return (
    <MainCenter>
      <List loading={loading} hoverable>
        {renderItem()}
      </List>
    </MainCenter>
  );
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Review;
