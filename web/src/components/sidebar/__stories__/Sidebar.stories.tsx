import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import type { SidebarProps } from '../Sidebar';
import Sidebar from '../Sidebar';
import {
  enableAddons,
  addCustomControls,
} from '@/utils/storybook-shared';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

// playground

const PlaygroundTemplate: Story<SidebarProps> = (props: SidebarProps) => {
  return (
    <div className="flex justify-center">
      <Sidebar {...props} />
    </div>
  );
};

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {};
enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);