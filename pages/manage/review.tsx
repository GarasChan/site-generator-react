import React, { ReactElement } from 'react';
import Main from '../../components/layout/main';
import { MainCenter } from '../../components/layout/main-center';

const Review = () => {
  return <MainCenter>我是审核页面</MainCenter>;
};

Review.getLayout = function getLayout(page: ReactElement) {
  return <Main>{page}</Main>;
};

export default Review;
