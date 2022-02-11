import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import type { SidebarProps } from '../Sidebar';
import Sidebar from '../Sidebar';
import type { SidebarItemProps } from '../SidebarItem';
import SidebarItem from '../SidebarItem';
import {
  enableAddons,
  addCustomControls,
} from '@/utils/storybook-shared';
import { createHome } from '@/assets/icons';

export default {
  title: 'Components/SidebarItem',
  component: SidebarItem,
};

// playground

// const PlaygroundTemplate: Story<SidebarProps> = (props: SidebarProps) => {
//   return (
//     <div className="flex justify-center">
//       <Sidebar {...props} />
//     </div>
//   );
// };

// export const Playground = PlaygroundTemplate.bind({});
// Playground.args = {};
// enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);

// SidebarItem playground

const SidebarItemTemplate: Story<SidebarItemProps> = (props: SidebarItemProps) => {
  return (
    <div className="flex justify-center">
      <SidebarItem {...props} />
    </div>
  );
}

export const SidebarItemPlayground = SidebarItemTemplate.bind({});
SidebarItemPlayground.args = {
  icon: createHome,
  label: 'Home',
  onPress: () => { console.log('hahahah') }
};
enableAddons(SidebarItemPlayground, ['controls', 'actions', 'a11y', 'backgrounds']);