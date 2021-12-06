import React, { useCallback, useContext, useEffect } from 'react';
import { Button, Result as ArcoResult, Spin } from '@arco-design/web-react';
import classNames from 'classnames';
import useSubmitFile from '../../hooks/useSubmitFile';
import SubmitContext from './context';

export interface MetaProps {
  hide?: boolean;
}

const Result = (props: MetaProps) => {
  const { data: value } = useContext(SubmitContext);
  const { hide } = props;
  const { data, loading, error } = useSubmitFile(value.name!, value.data, value.content);

  return (
    <div className={classNames({ hidden: hide })}>
      {loading ? (
        <Spin dot />
      ) : (
        <ArcoResult
          status={error ? 'error' : 'success'}
          title="提交成功"
          subTitle={error ? JSON.stringify(error) : ''}
          extra={
            error
              ? [
                  <Button key="again" type="secondary">
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
