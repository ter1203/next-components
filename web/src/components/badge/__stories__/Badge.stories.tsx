import { createBell } from '@/assets/icons';
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
  { variant, size, isOutline, isLight }: Pick<BadgeProps, 'variant' | 'size' | 'isOutline' | 'isLight'>
): ReactElement => {
  return (
    <div className='flex gap-4'>
      <div className='w-[100px] flex'>
        <Badge
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
      <div className='w-[100px] flex'>
        <Badge
          icon={createBell}
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
      <div className='w-[100px] flex'>
        <Badge
          onDismiss={action('press')}
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
      <div className='w-[100px] flex'>
        <Badge
          icon={createBell}
          onDismiss={action('press')}
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
      <div className='w-[100px] flex'>
        <Badge
          image='/images/w3.png'
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
      <div className='w-[100px] flex'>
        <Badge
          image='/images/w3.png'
          onDismiss={action('press')}
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
      <div className='w-[100px] flex'>
        <Badge
          icon={createBell}
          image='/images/w3.png'
          onDismiss={action('press')}
          variant={variant}
          size={size}
          isOutline={isOutline}
          isLight={isLight}
        >
          Text
        </Badge>
      </div>
    </div>
  )
}

const BadgeByOutline = (
  { size, variant, title }: Pick<BadgeProps, 'size' | 'variant'> & { title: string }
): ReactElement => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-body-lg-heavy my-2'>{title}</h2>
      <BadgeByContent size={size} variant={variant} />
      <BadgeByContent size={size} variant={variant} isOutline />
      <BadgeByContent size={size} variant={variant} isLight />
      <BadgeByContent size={size} variant={variant} isOutline isLight />
    </div>
  )
}

const BadgeByVariant = (
  { size }: Pick<BadgeProps, 'size'>
): ReactElement => {
  return (
    <div className='flex flex-col gap-y-4'>
      <BadgeByOutline title='Variant - Default' variant='default' size={size} />
      <BadgeByOutline title='Variant - Primary' variant='primary' size={size} />
      <BadgeByOutline title='Variant - Danger' variant='danger' size={size} />
      <BadgeByOutline title='Variant - Success' variant='success' size={size} />
      <BadgeByOutline title='Variant - Info' variant='info' size={size} />
      <BadgeByOutline title='Variant - Warning' variant='warning' size={size} />
      <BadgeByOutline title='Variant - Dark' variant='dark' size={size} />
      <BadgeByOutline title='Variant - Ghost' variant='ghost' size={size} />
    </div>
  )
}

export const Small = (): ReactElement => (
  <BadgeByVariant size='small' />
)

export const Medium = (): ReactElement => (
  <BadgeByVariant size='medium' />
)

export const Large = (): ReactElement => (
  <BadgeByVariant size='large' />
)