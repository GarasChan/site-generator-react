import React from 'react';

export interface ArticleContentProps {
  content: string;
}

const ArticleContent = (props: ArticleContentProps) => {
  const { content } = props;
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
};

export default ArticleContent;
