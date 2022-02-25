import { createRingInfo } from '@/assets/icons';
import { enableAddons } from '@/utils/storybook-shared';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import React, { ReactElement } from 'react';
import type { BadgeProps } from '../Badge';
import Badge from '../Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
};

// playground

const PlaygroundTemplate: Story<BadgeProps> = (props) => {
  return (
    <div className="flex justify-center">
      <Badge {...props}>Text</Badge>
    </div>
  );
};

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  size: 'medium',
  variant: 'default',
  onDismiss: action('press')
};
enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);

const BadgeByContent = (
  { variant, size, isOutline, isLight, isGhost, children }: Pick<BadgeProps, 'variant' | 'size' | 'isOutline' | 'isLight' | 'isGhost' | 'children'>
): ReactElement => {

  const defaultProps = {
    variant, size, isOutline, isLight, isGhost
  };

  return (
    <div className='flex gap-2 flex-wrap my-2'>
      <Badge {...defaultProps}>{children}</Badge>

      <Badge {...defaultProps} icon={createRingInfo}>
        {children}
      </Badge>

      <Badge {...defaultProps} onDismiss={action('press')}>
        {children}
      </Badge>

      <Badge
        {...defaultProps}
        icon={createRingInfo}
        onDismiss={action('press')}
      >
        {children}
      </Badge>

      <Badge {...defaultProps} image='/images/avatar.png'>
        {children}
      </Badge>

      <Badge
        {...defaultProps}
        image='/images/avatar.png'
        onDismiss={action('press')}
      >
        {children}
      </Badge>

      <Badge
        {...defaultProps}
        icon={createRingInfo}
        image='/images/avatar.png'
        onDismiss={action('press')}
      >
        {children}
      </Badge>
    </div>
  )
}

const BadgeByOutline = (
  { size, variant, title }: Pick<BadgeProps, 'size' | 'variant'> & { title: string }
): ReactElement => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-body-lg-heavy my-2'>{title}</h2>
      <BadgeByContent size={size} variant={variant}>
        Normal
      </BadgeByContent>

      <BadgeByContent size={size} variant={variant} isOutline>
        Outlined
      </BadgeByContent>

      <BadgeByContent size={size} variant={variant} isLight>
        Light Mode
      </BadgeByContent>

      <BadgeByContent size={size} variant={variant} isOutline isLight>
        Outline and Light
      </BadgeByContent>

      <BadgeByContent size={size} variant={variant} isGhost>
        Ghost
      </BadgeByContent>
    </div>
  )
}

const BadgeBySize = (
  { variant }: Pick<BadgeProps, 'variant'>
): ReactElement => {
  return (
    <div className='flex flex-col gap-y-4'>
      <BadgeByOutline title='Small Badges' size='small' variant={variant} />
      <BadgeByOutline title='Medium Badges' size='medium' variant={variant} />
    </div>
  )
}

export const Default = (): ReactElement => (
  <BadgeBySize variant='default' />
)

export const Primary = (): ReactElement => (
  <BadgeBySize variant='primary' />
)

export const Danger = (): ReactElement => (
  <BadgeBySize variant='danger' />
)

export const Success = (): ReactElement => (
  <BadgeBySize variant='success' />
)

export const Info = (): ReactElement => (
  <BadgeBySize variant='info' />
)

export const Warning = (): ReactElement => (
  <BadgeBySize variant='warning' />
)
