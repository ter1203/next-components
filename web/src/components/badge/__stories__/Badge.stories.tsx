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

const BadgeByOutline = (props: BadgeProps & { title: string }): ReactElement => {
  const { title, ...others } = props;
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-body-lg-heavy my-2'>{title}</h2>
      <BadgeByContent {...others}>
        Normal
      </BadgeByContent>

      <BadgeByContent {...others} isOutline>
        Outlined
      </BadgeByContent>

      <BadgeByContent {...others} isLight>
        Light Mode
      </BadgeByContent>

      <BadgeByContent {...others} isOutline isLight>
        Outline and Light
      </BadgeByContent>

      <BadgeByContent {...others} isGhost>
        Ghost
      </BadgeByContent>
    </div>
  )
}

const BadgeBySize = (props: BadgeProps): ReactElement => {
  return (
    <div className='flex flex-col gap-y-4'>
      <BadgeByOutline {...props} title='Small Badges' size='small' />
      <BadgeByOutline {...props} title='Medium Badges' size='medium' />
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
