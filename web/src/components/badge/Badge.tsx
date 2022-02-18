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

export type BadgeProps = StyleProps &
  Pick<AvatarProps, 'image'> & Omit<
    AriaButtonProps<'button'>,
    OmittedAriaProps | 'target' | 'href' | 'rel'
  > & {
    /**
     * The size of the badge.
     * @default "medium"
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * The badge style variant.
     * @default "default"
     */
    variant?: 'default' | 'primary' | 'success' | 'danger' | 'dark' | 'info' | 'warning' | 'ghost';

    /**
     * Whether the badge is visually outlined.
     * @default 'false'
     */
    isOutline?: boolean;

    /**
     * Whether the badge is lightened
     * @default 'true'
     */
    isLight?: boolean;

    /** The badge's icon (svg path). */
    icon?: string;

    /** The badge's content. */
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
  isDismissible: false,
} as const;

const DISMISS_ICON = createClose;

const PolymorphicBadge = React.forwardRef(function PolymorphicBadge(
  { as: Comp = 'div', ...props },
  forwardedRef
) {
  return <Comp {...props} ref={forwardedRef} />;
}) as ForwardRefComponent<'div', unknown>;

function DismissButton(p: AriaButtonProps<'button'>) {
  const domRef = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton(p, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled: p.isDisabled });
  const behaviorProps = mergeProps(buttonProps, hoverProps);

  return (
    <button
      {...behaviorProps}
      tabIndex={0}
      className={clsx(el`dismiss-button`, {
        'is-hovered': isHovered,
        'is-pressed': isPressed,
      })}
    >
      <Icon
        className={el`dismiss-button-icon`}
        content={DISMISS_ICON}
        size="custom"
      />
    </button>
  );
}

function Badge(
  props: BadgeProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLDivElement>
): ReactElement {
  const p = { ...DEFAULT_PROPS, ...props };
  const domRef = useOptionalRef(ref);

  const isInteractive = !!p.onDismiss;
  const { buttonProps, isPressed } = useButton(p, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled: p.isDisabled });
  const interactiveProps = isInteractive ? [buttonProps, hoverProps] : [];
  const behaviorProps = mergeProps(...interactiveProps);

  const hasAvatar = p.image;
  const hasIcon = p.icon || hasAvatar
  return (
    <PolymorphicBadge
      as={isInteractive ? 'button' : 'div'}
      {...behaviorProps}
      className={clsx([
        `${ROOT} size-${p.size} variant-${p.variant}`,
        {
          'is-outline': p.isOutline,
          'is-light': p.isLight,
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
      {p.onDismiss && <DismissButton onPress={p.onDismiss} />}
    </PolymorphicBadge>
  );
}

export default Badge;
