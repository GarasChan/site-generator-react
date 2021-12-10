import { PropsWithChildren, ReactElement, ReactNode } from 'react';

export interface MainCenterProps {}

export const MainCenter = (props: PropsWithChildren<MainCenterProps>) => (
  <div style={{ maxWidth: 1440, margin: 'auto' }}>{props.children}</div>
);
