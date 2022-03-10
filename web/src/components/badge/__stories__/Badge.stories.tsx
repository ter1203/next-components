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

const AVATAR_URL = 'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg';
// playground

const PlaygroundTemplate: Story<BadgeProps> = (props) => {
  return (
    <div className="flex justify-center">
      <Badge {...props}>Badge</Badge>
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

const BadgeByContent = (props: BadgeProps): ReactElement => {
  return (
    <div className='flex gap-2 flex-wrap my-2'>
      <Badge {...props} />

      <Badge {...props} icon={createRingInfo} />

      <Badge {...props} onDismiss={action('press')} isDismissible />

      <Badge
        {...props}
        icon={createRingInfo}
        onDismiss={action('press')}
        isDismissible
      />

      <Badge {...props} avatar={AVATAR_URL} />

      <Badge
        {...props}
        avatar={AVATAR_URL}
        onDismiss={action('press')}
        isDismissible
      />

      <Badge
        {...props}
        avatar={AVATAR_URL}
        onDismiss={action('press')}
        isDismissible
        isDisabled
      />

      <Badge
        {...props}
        icon={createRingInfo}
        avatar={AVATAR_URL}
        onDismiss={action('press')}
        isDismissible
      />
    </div>
  )
}

const BadgeByOutline = (props: BadgeProps): ReactElement => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-body-md-heavy my-0'>Normal</h2>
      <BadgeByContent {...props} />
      <h2 className='text-body-md-heavy my-0'>Light</h2>
      <BadgeByContent {...props} isLight />
      <h2 className='text-body-md-heavy my-0'>Ghost</h2>
      <BadgeByContent {...props} isGhost />
      <h2 className='text-body-md-heavy my-0'>Outlined</h2>
      <BadgeByContent {...props} isOutline />
      <h2 className='text-body-md-heavy my-0'>Outlined + Light</h2>
      <BadgeByContent {...props} isOutline isLight />
    </div>
  )
}

const BadgeBySize = (props: BadgeProps): ReactElement => {
  return (
    <div className='flex flex-col gap-y-4'>
      <h2 className='text-body-lg-heavy my-2'>Small Badges</h2>
      <BadgeByOutline {...props} size='small'>
        Badge
      </BadgeByOutline>

      <h2 className='text-body-lg-heavy my-2'>Medium Badges</h2>
      <BadgeByOutline {...props} size='medium'>
        Badge
      </BadgeByOutline>
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
