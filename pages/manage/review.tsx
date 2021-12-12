import { Avatar, Button, Link, List, Message, Space, Tag, Tooltip } from '@arco-design/web-react';
import React, { MouseEventHandler, ReactElement, useCallback, useMemo } from 'react';
import Main from '../../components/layout/main';
import { MainCenter } from '../../components/layout/main-center';
import { InferGetServerSidePropsType } from 'next';
import statsUtil, { FileInfo } from '../../utils/stats';
import { IconCalendarClock, IconHistory } from '@arco-design/web-react/icon';

const { Item } = List;

const Review = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const renderTitle = useCallback((title: string, categories?: string[]) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{title}</span>
        {categories && (
          <Space style={{ marginLeft: 8, lineHeight: 1 }}>
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
      <Space>
        {tags.map((t, i) => (
          <Tooltip key={t + i} content={`标签：${t}`}>
            <Tag size="small">{t}</Tag>
          </Tooltip>
        ))}
      </Space>
    );
  }, []);

  const allow = useCallback((e) => {
    e.stopImmediatePropagation();
    Message.success('审批成功');
  }, []);

  return (
    <MainCenter>
      <List
        hoverable
        dataSource={Object.entries(data).map(([filename, info]) => ({ ...info, filename }))}
        render={({
          filename,
          originFilename,
          categories,
          tags,
          createTime,
          updateTime
        }: FileInfo & { filename: string }) => (
          <Item
            key={filename}
            actions={[
              <Button key="error" size="small" type="text" status="danger" disabled>
                拒绝
              </Button>,
              <Button key="success" size="small" type="text" status="success" onClick={allow}>
                同意
              </Button>
            ]}
            onClick={() => {
              console.log('zzq');
            }}
          >
            <Item.Meta
              title={renderTitle(originFilename, categories)}
              description={renderDesc('', tags)}
              avatar={<Avatar shape="square">md</Avatar>}
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
          </Item>
        )}
      />
    </MainCenter>
  );
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export const getServerSideProps = async () => {
  return {
    props: {
      data: statsUtil.get()
    }
  };
};

export default Review;
