import clsx from 'clsx';
import React, { ReactElement } from 'react';
import {
  makeElementClassNameFactory,
  makeRootClassName,
  StyleProps,
} from '@/utils';

export type SidebarProps = StyleProps & {
  // add props here
};

const ROOT = makeRootClassName('Sidebar');
const el = makeElementClassNameFactory(ROOT);

const DEFAULT_PROPS = {} as const;

function Sidebar(props: SidebarProps): ReactElement { 
  const p = { ...DEFAULT_PROPS, ...props };

  return (
    <div className={clsx(ROOT, p.className)}>
      TODO: Sidebar is not implemented.
    </div>
  ); 
};

export default Sidebar;