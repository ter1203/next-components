import React from 'react';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import type { DismissButtonProps } from '../DismissButton';
import DismissButton from '../DismissButton';
import { enableAddons } from '@/utils/storybook-shared';

export default {
  title: 'Components/DismissButton',
  component: DismissButton,
};

// playground

const PlaygroundTemplate: Story<DismissButtonProps> = (props: DismissButtonProps) => {
  return (
    <div className="flex justify-center">
      <DismissButton {...props} />
    </div>
  );
};

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  onPress: action('press')
};
enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);