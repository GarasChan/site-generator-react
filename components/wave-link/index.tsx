import { AnchorHTMLAttributes, forwardRef, Ref } from 'react';
import classNames from 'classnames';
import style from './index.module.less';

export interface WaveLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  animation?: boolean;
}

const WaveLink = ({ animation = true, className, ...rest }: WaveLinkProps, ref: Ref<HTMLAnchorElement>) => (
  <a ref={ref} {...rest} className={classNames(style['wave-link'], { [style.wave]: animation }, className)} />
);

export default forwardRef(WaveLink);
