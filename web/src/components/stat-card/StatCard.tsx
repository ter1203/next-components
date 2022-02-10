import clsx from 'clsx';
import React, { ReactElement, ForwardedRef, forwardRef, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import {
  makeElementClassNameFactory,
  makeRootClassName,
  StyleProps,
  TooltipComponentProps,
  useTooltipComponentProps,
  TooltipForwardProps,
  useTooltipForwardProps
} from '@/utils';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useOptionalRef } from '@/hooks';
import type { ButtonProps } from '../button';
import Icon, { IconData } from '../icon/Icon';
import { trendingDown, trendingUp } from '@/assets/icons';
import Badge from '../badge/Badge';
import { OptionalTooltip } from '../tooltip/Tooltip';
import Text from '../text/Text'

export type StatCardProps = StyleProps &
  Pick<TooltipComponentProps, 'tooltipSide'> &
  Omit<TooltipForwardProps, 'onKeyDown' | 'onBlur'> & {
    /**
     * The size of the stat card
     * @default "medium"
     */
    size?: 'small' | 'medium' | 'large' | 'custom';

    /**
     * Main stat of the card
     */
    title: string;

    /**
     * Description string of the card
     */
    description: string;

    /**
     * Icon of the stat card positioned at the left-top
     */
    icon?: IconData | ReactElement

    /**
     * Optional badge of the card. If badgeLabel is available,
     * badge would be displayed at the right-top of the card.
     */
    badgeLabel?: string;

    /**
     * Whether the recent stat is positive or negative
     */
    variant?: 'positive' | 'negative'

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
  size: 'medium'
} as const;

function StatCardComponent(
  props: StatCardProps,
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

  const cardProps = isInteractive ? mergeProps(
    buttonProps, hoverProps, focusProps, tooltipForwardProps
  ) : tooltipForwardProps;

  // trends data for rechart to use
  const trends = useMemo(() => {
    if (p.trend) {
      return p.trend.map((value: number) => ({ v: value }))
    } else {
      return []
    }
  }, [p.trend]);

  const variantIcon = useMemo(() => {
    if (p.variant) {
      return (p.variant === 'positive') ? trendingUp : trendingDown;
    }
  }, [p.variant])

  return (
    <OptionalTooltip {...tooltipProps} content={p.tooltip} isInstant>
      <div
        {...cardProps}
        className={clsx(
          `${ROOT} size-${p.size}`,
          { 
            'is-hovered': isHovered,
            'is-pressed': isPressed,
            'is-focus-visible': isFocusVisible,
          },
          p.className
        )}
      >
        <section className={el`content`}>
          {!!p.icon && <Icon className={el`icon`} content={p.icon} />}
          <Text type='h4' className={el`title`}>{p.title}</Text>
          <Text type='body-sm' className={el`desc`}>{p.description}</Text>
        </section>

        {(trends.length > 0 || !!p.variant) && (
          <section className={el`trend`}>
            {p.variant && (
              <Icon content={variantIcon} className={`icon-${p.variant}`} />
            )}
            {trends.length > 0 && (
              <ResponsiveContainer width='60%' height='50%'>
                <LineChart data={trends} width={200} height={160}>
                  <Line type="monotone" dot={false} dataKey="v" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
        )}

        {p.badgeLabel && (
          <span className={el`badge`}>
            <Badge variant='primary'>{p.badgeLabel}</Badge>
          </span>
        )}

        {isInteractive && <div className={el`overlay`} />}
      </div>
    </OptionalTooltip>
  );
};

export const StatCard = forwardRef<HTMLElement, StatCardProps>(StatCardComponent);

export default StatCard;