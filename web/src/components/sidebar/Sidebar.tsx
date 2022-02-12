import clsx from 'clsx';
import React, { PropsWithChildren, ReactElement } from 'react';
import {
  makeElementClassNameFactory,
  makeRootClassName,
  StyleProps,
} from '@/utils';

export type SidebarProps = PropsWithChildren<StyleProps> & {
  /**
   * Logo image
   */
  logo: ReactElement;

  /**
   * Sidebar size
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Collapsed flag
   * @default false
   */
  isCollapsed?: boolean;

  /**
   * Dark mode
   * @default: false
   */
  isDarkMode?: boolean;
};

const ROOT = makeRootClassName('Sidebar');
const el = makeElementClassNameFactory(ROOT);

const DEFAULT_PROPS = {
  size: 'medium',
  isCollapsed: false,
  isDarkMode: false,
} as const;

function Sidebar(props: SidebarProps): ReactElement { 
  const p = { ...DEFAULT_PROPS, ...props };

  return (
    <aside
      className={clsx(
        `${ROOT} size-${p.size}`,
        { 'is-dark': p.isDarkMode, 'is-collapsed': p.isCollapsed },
        p.className)
      }
    >
      <div className={el`logo`}>{p.logo}</div>
      {p.children}
    </aside>
  );
};

export default Sidebar;