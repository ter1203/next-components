import React, { ForwardedRef, ReactElement, useRef } from 'react';
import clsx from 'clsx';
import { ForwardRefComponent } from '@radix-ui/react-polymorphic';
import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { createClose } from '@/assets/icons';
import {
  makeElementClassNameFactory,
  makeRootClassName,
  OmittedAriaProps,
  StyleProps
} from '@/utils';
import { useOptionalRef } from '@/hooks';
import { Icon } from '../icon';
import Avatar from '../avatar/Avatar'
import type { AvatarProps } from '../avatar/Avatar';
import { DismissButton } from '..';

export type BadgeProps = StyleProps &
  Pick<AvatarProps, 'image'> & {
    /**
     * Size of the badge.
     * @default "medium"
     */
    size?: 'small' | 'medium';

    /**
     * The badge's visual appearance.
     * @default "default"
     */
    variant?: 'default' | 'primary' | 'success' | 'danger' | 'dark' | 'info' | 'warning';

    /**
     * Whether the badge is visually outlined.
     * @default 'false'
     */
    isOutline?: boolean;

    /**
     * Whether the badge is light mode
     */
    isLight?: boolean;

    /**
     * Whether the badge has de-emphasized (ghost) styles.
     * @default false
     */
    isGhost?: boolean;

    /** Icon data of the badge */
    icon?: string;

    /** Content of the badge */
    children?: string | number;

    /**
     * Handler that is called when the badge is dismissed.
     * Whether the badge can be dismissed is determined by this value
     */
    onDismiss?: () => void;
  };

const ROOT = makeRootClassName('Badge');
const el = makeElementClassNameFactory(ROOT);

const DEFAULT_PROPS = {
  size: 'medium',
  variant: 'default',
  isOutlined: false,
  isGhost: false,
} as const;


function BadgeComponent(
  props: BadgeProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement {
  const p = { ...DEFAULT_PROPS, ...props };
  const domRef = useOptionalRef(ref);

  const isInteractive = !!p.onDismiss;
  const { buttonProps, isPressed } = useButton(p, domRef);
  const { hoverProps, isHovered } = useHover({isDisabled: !isInteractive});
  const interactiveProps = isInteractive ? [buttonProps, hoverProps] : [];
  const behaviorProps = mergeProps(...interactiveProps);

  const hasAvatar = p.image;
  const hasIcon = p.icon || hasAvatar
  return (
    <div
      {...behaviorProps}
      className={clsx([
        `${ROOT} size-${p.size} variant-${p.variant}`,
        {
          'is-outline': p.isOutline,
          'is-light': p.isLight,
          'is-ghost': p.isGhost,
          'has-icon': hasIcon,
          'has-avatar': hasAvatar,
          'is-interactive': isInteractive,
          'is-hovered': isHovered,
          'is-pressed': isPressed,
        },
        p.className,
      ])}
    >
      {hasIcon ? hasAvatar ? (
        <Avatar
          image={p.image}
          size="custom"
          className={el`avatar`}
        />
      ) : (
        <Icon className={el`icon`} content={p.icon} size="custom" />
      ) : null}
      {p.children}
      {p.onDismiss && (
        <DismissButton
          onPress={p.onDismiss}
          size='custom'
          className={el`dismiss-button`}
        />
      )}
    </div>
  );
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(BadgeComponent);

export default Badge;
