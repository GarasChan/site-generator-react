import React, { useContext } from 'react';
import { Button, Result as ArcoResult, Spin } from '@arco-design/web-react';
import SubmitContext from './context';
import useRequest from '../../hooks/useRequest';

const Result = () => {
  const { data: value } = useContext(SubmitContext);
  const { data, error, loading, retry } = useRequest({
    url: `/api/update?name=${value.name}`,
    method: 'POST',
    data: { data: value.data, content: value.content }
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {loading ? (
        <Spin dot />
      ) : (
        <ArcoResult
          status={error ? 'error' : 'success'}
          title={error ? '提交失败' : '提交成功'}
          subTitle={error ? error.message : ''}
          extra={
            error
              ? [
                  <Button key="again" type="secondary" onClick={retry}>
                    重试
                  </Button>
                ]
              : []
          }
        />
      )}
    </div>
  );
};

export default Result;
