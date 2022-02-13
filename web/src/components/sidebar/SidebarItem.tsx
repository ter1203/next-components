import clsx from 'clsx';
import React, { ReactElement, ForwardedRef, forwardRef } from 'react';
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
  label: string;

  /**
   * Item icon
   */
  icon: IconData;

  /**
   * Icon viewbox size
   * @default 20
   */
  iconViewbox?: number;

  /**
   * Whether to show selected styles for this item.
   * @default false
   */
  isSelected?: boolean;

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

const ROOT = makeRootClassName('Sidebar');
const el = makeElementClassNameFactory(ROOT);

const DEFAULT_PROPS = {
  iconViewbox: 20,
  isSelected: false,
  badge: '',
} as const;

function SidebarItemComponent(
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

  const behaviorProps = isInteractive ? mergeProps(
    buttonProps, hoverProps, focusProps, tooltipForwardProps
  ) : tooltipForwardProps;

  return (
    <OptionalTooltip {...tooltipProps} content={p.tooltip} isInstant>
      <div
        {...behaviorProps}
        className={clsx(
          el`item`,
          {
            'is-hovered': isHovered,
            'is-pressed': isPressed,
            'is-focus-visible': isFocusVisible,
            'is-selected': p.isSelected
          },
          p.className
        )}
      >
        <Icon
          content={p.icon}
          className={el`item-icon`}
          viewBoxWidth={p.iconViewbox}
          viewBoxHeight={p.iconViewbox}
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

export const SidebarPadding = () => {
  return (
    <div className={el`item-padder`} />
  )
}

const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(SidebarItemComponent);

export default SidebarItem;