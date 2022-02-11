import clsx from 'clsx';
import React, { ReactElement, ForwardedRef } from 'react';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import {
  makeElementClassNameFactory,
  makeRootClassName,
  StyleProps,
  TooltipComponentProps,
  TooltipForwardProps,
  useTooltipComponentProps,
  useTooltipForwardProps
} from '@/utils';
import { useOptionalRef } from '@/hooks';
import Icon, { IconData } from '../icon/Icon';
import type { ButtonProps } from '../button';
import Badge from '../badge/Badge';
import { OptionalTooltip } from '../tooltip/Tooltip';
import Text from '../text/Text'


export type SidebarItemProps = StyleProps & 
  Pick<TooltipComponentProps, 'tooltipSide'> &
  Omit<TooltipForwardProps, 'onKeyDown' | 'onBlur'> & {
  /**
   * Item label next to the icon
   */
  label: string | ReactElement;

  /**
   * Item icon
   */
  icon: IconData | ReactElement;

  /**
   * Item size
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Active flag
   * @default false
   */
  active?: boolean;

  /**
   * Badge
   */
  badge?: string;

  /**
   * Optional tooltip
   */
  tooltip?: string;

  /**
   * Link
   */
  href?: string;

  /**
   * Press handler
   */
  onPress?: ButtonProps['onPress'];
};

const ROOT = makeRootClassName('SidebarItem');
const el = makeElementClassNameFactory(ROOT);

const DEFAULT_PROPS = {
  size: 'medium',
  active: false,
  badge: '',
} as const;

function SidebarItem(
  props: SidebarItemProps,
  ref: ForwardedRef<HTMLElement>
): ReactElement { 
  const p = { ...DEFAULT_PROPS, ...props };
  const tooltipProps = useTooltipComponentProps(p);
  const tooltipForwardProps = useTooltipForwardProps(p);

  const domRef = useOptionalRef(ref)
  const isInteractive = !!p.onPress
  const { buttonProps, isPressed } = useButton(p, domRef)
  const { hoverProps, isHovered } = useHover({});
  const { focusProps, isFocusVisible } = useFocusRing();

  const itemProps = isInteractive ? mergeProps(
    buttonProps, hoverProps, focusProps, tooltipForwardProps
  ) : tooltipForwardProps;

  return (
    <OptionalTooltip {...tooltipProps} content={p.tooltip} isInstant>
      <div
        {...itemProps}
        className={clsx(
          `${ROOT} ${el`item`} size-${p.size}`,
          {
            'is-hovered': isHovered,
            'is-pressed': isPressed,
            'is-focus-visible': isFocusVisible,
            'is-active': p.active
          },
          p.className
        )}
      >
        <Icon
          content={p.icon}
          className={el`item-icon`}
          viewBoxWidth={24}
          viewBoxHeight={24}
        />
        <Text className={el`item-label`}>
          {p.label}
        </Text>
        {!!p.badge && <Badge variant='primary' isOutline className={el`item-badge`}>{p.badge}</Badge>}
        {isInteractive && <div className={el`overlay`} />}
      </div>
    </OptionalTooltip>
  ); 
};

export default SidebarItem;