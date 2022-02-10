import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import type { StatCardProps } from '../StatCard';
import StatCard from '../StatCard';
import {
  enableAddons,
  addCustomControls,
} from '@/utils/storybook-shared';

export default {
  title: 'Components/StatCard',
  component: StatCard,
};

// playground

const PlaygroundTemplate: Story<StatCardProps> = (props: StatCardProps) => {
  return (
    <div className="flex justify-center">
      <StatCard {...props} />
    </div>
  );
};

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {};
enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);