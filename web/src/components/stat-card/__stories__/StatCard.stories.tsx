import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import type { StatCardProps } from '../StatCard';
import StatCard from '../StatCard';
import { enableAddons } from '@/utils/storybook-shared';
import { svgGithub } from '@/assets/icons';

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
Playground.args = {
  icon: svgGithub,
  title: '+ $200M',
  description: '45% this week',
  trend: [1, 8, 30, 45, 50],
  onPress: () => { console.log('hahaha') },
  badgeLabel: '+10'
};
enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);