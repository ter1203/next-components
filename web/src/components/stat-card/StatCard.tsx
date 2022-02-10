import clsx from 'clsx';
import React, { ReactElement, PropsWithChildren, ForwardedRef, forwardRef } from 'react';
import {
  makeElementClassNameFactory,
  makeRootClassName,
  StyleProps,
  TooltipComponentProps,
  useTooltipComponentProps
} from '@/utils';
import { useButton } from '@react-aria/button';
import { useOptionalRef } from '@/hooks';
import type { ButtonProps } from '../button';
import Icon, { IconData } from '../icon/Icon';
import Badge, { BadgeProps } from '../badge/Badge';
import { OptionalTooltip } from '../tooltip/Tooltip';

export type StatCardProps = PropsWithChildren<StyleProps> &
  Pick<TooltipComponentProps, 'tooltipSide'> & {
    /**
     * The size of the stat card
     * @default "medium"
     */
    size?: 'small' | 'medium' | 'large' | 'xl' | '2xl';

    /**
     * Main stat of the card
     */
    title: string;

    /**
     * Description string of the card
     */
    description?: string;

    /**
     * Icon of the stat card positioned at the left-top
     */
    icon?: IconData

    /**
     * Optional badge of the card. If badgeLabel is available,
     * badge would be displayed at the right-top of the card.
     */
    badgeLabel?: string;

    /**
     * Whether the recent stat is positive or negative
     * @default "default"
     */
    variant?: 'default' | 'positive' | 'negative'

    /**
     * Recent trends that shows the latest trend. The value range
     * is [1, 100]
     */
    trend?: number[];

    /**
     * Press handler
     */
    onPress?: ButtonProps['onPress']

    /**
     * Optional tooltip
     */
    tooltip?: string;
  };

const ROOT = makeRootClassName('StatCard');
const el = makeElementClassNameFactory(ROOT);

const DEFAULT_PROPS = {
  size: 'medium',
  variant: 'default'
} as const;

function StatCardComponent(
  props: StatCardProps,
  ref: ForwardedRef<HTMLElement>
): ReactElement {
  const p = { ...DEFAULT_PROPS, ...props };
  const tooltipProps = useTooltipComponentProps(p);

  const domRef = useOptionalRef(ref)
  const isInteractive = !!p.onPress
  const { buttonProps, isPressed } = useButton(p, domRef)

  return (
    <OptionalTooltip {...tooltipProps} content={p.tooltip} isInstant>
      <div
        {...buttonProps}
        className={clsx(
          `${ROOT} size-${p.size}`,
          { 'is-pressed': isPressed },
          p.className
        )}
      >
        
        {isInteractive && <div className={el`overlay`} />}
      </div>
    </OptionalTooltip>
  );
};


export const StatCard = forwardRef<HTMLElement, StatCardProps>(StatCardComponent);

export default StatCard;