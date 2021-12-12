import React, { useCallback, useContext } from 'react';
import { Button, Result as ArcoResult, Spin } from '@arco-design/web-react';
import SubmitContext from './context';
import useRequest from '../../hooks/useRequest';

const Result = () => {
  const { data, updateData, go } = useContext(SubmitContext);
  const {
    data: result,
    error,
    loading,
    retry
  } = useRequest({
    url: '/api/upload',
    method: 'POST',
    data
  });

  const handleFirst = useCallback(() => {
    updateData(null);
    go(1);
  }, [go, updateData]);

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
                  <Button key="again" type="primary" onClick={retry}>
                    重新提交
                  </Button>
                ]
              : [
                  <Button key="again" type="primary" onClick={handleFirst}>
                    继续提交
                  </Button>
                ]
          }
        />
      )}
    </div>
  );
};

export default Result;
