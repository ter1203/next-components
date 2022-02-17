import React, { ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import type { SidebarProps } from '../Sidebar';
import Sidebar from '../Sidebar';
import Icon from '../../icon/Icon'
import type { SidebarItemProps } from '../SidebarItem';
import SidebarItem, { SidebarSectionSpacer } from '../SidebarItem';
import { enableAddons } from '@/utils/storybook-shared';
import {
  createHome,
  createMenu,
  svgSetting,
} from '@/assets/icons';
const iconCalendar = 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
const iconMail = 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
const iconBolt = 'M13 10V3L4 14h7v7l9-11h-7z';
const iconBell = 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
const iconReport = 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z';
const iconLibrary = 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z';
const iconSupport = 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z';
const iconDocument = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
const iconUser = 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z';


export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

// Logo

const Logo = (): ReactElement => (
  <Icon
    size='custom'
    content={iconSupport}
    className='text-purple-600 w-8 h-8 mx-2'
    viewBoxHeight={24}
    viewBoxWidth={24}
  />
)

// playground
const PlaygroundTemplate: Story<SidebarProps> = (props: SidebarProps) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(!props.isCollapsed)
  }, [props.isCollapsed])

  const defaultProps = {
    _iconViewbox: 24,
    onPress: action('press')
  }

  return (
    <div className='flex flex-col bg-dark-gray-600'>
      <div className='flex p-2 h-14'>
        <div className='!w-10 !h-10 p-2 cursor-pointer' onClick={() => setOpen(open => !open)}>
          <Icon
            content={createMenu}
            className='text-gray-50 !w-6 !h-6'
          />
        </div>
      </div>
      <div className="flex w-[800px] h-[800px] bg-white overflow-y-auto">
        <Sidebar {...props} isCollapsed={!open} className='w-[320px]'>
          <SidebarItem icon={createHome} {...defaultProps}>
            Home
          </SidebarItem>
          <SidebarItem icon={iconReport} {...defaultProps}>
            Reports
          </SidebarItem>
          <SidebarItem icon={iconLibrary} {...defaultProps}>
            Library
          </SidebarItem>
          <SidebarItem icon={iconCalendar} {...defaultProps}>
            Calendar
          </SidebarItem>
          <SidebarItem icon={iconBolt} {...defaultProps}>
            Integrations
          </SidebarItem>
          <SidebarItem icon={iconDocument} {...defaultProps}>
            Documents
          </SidebarItem>
          <SidebarSectionSpacer />
          <SidebarItem icon={iconMail} {...defaultProps} badge='3'>
            Messages
          </SidebarItem>
          <SidebarItem icon={iconBell} {...defaultProps} badge='6'>
            Notifications
          </SidebarItem>
          <SidebarItem icon={svgSetting} {...defaultProps}>
            Settings
          </SidebarItem>
          <SidebarItem icon={iconUser} {...defaultProps}>
            Profile
          </SidebarItem>
        </Sidebar>
      </div>
    </div>
  );
};

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  logo: <Logo />
};
enableAddons(Playground, ['controls', 'actions', 'a11y', 'backgrounds']);

const SidebarItemVariant = (): ReactElement => {
  return (
    <>
      <SidebarItem icon={createHome} _iconViewbox={24}>
        Item without badge
      </SidebarItem>
      <SidebarItem icon={createHome} _iconViewbox={24} badge='6'>
        Item with badge
      </SidebarItem>
      <SidebarItem icon={createHome} _iconViewbox={24} badge='11' onPress={action('press')}>
        Interactive item
      </SidebarItem>
      <SidebarItem icon={createHome} _iconViewbox={24} onPress={action('press')} isSelected>
        Selected item
      </SidebarItem>
    </>
  )
}

const SidebarVariant = (
  { title, size }: { title: string, size?: 'small' | 'medium' | 'large' }
): ReactElement => {
  return (
    <>
      <h2 className='text-body-lg-heavy mt-6 mb-2'>{title}</h2>
      <h3 className='text-body-md-heavy my-2'>Normal</h3>
      <Sidebar logo={<Logo />} size={size}>
        <SidebarItemVariant />
      </Sidebar>
      <h3 className='text-body-md-heavy my-2'>Dark mode</h3>
      <Sidebar logo={<Logo />} size={size} isDarkMode>
        <SidebarItemVariant />
      </Sidebar>
      <h3 className='text-body-md-heavy my-2'>Collapsed</h3>
      <Sidebar logo={<Logo />} size={size} isDarkMode isCollapsed>
        <SidebarItemVariant />
      </Sidebar>
    </>
  )
}
const ItemTemplate: Story<SidebarItemProps> = () => {
  return (
    <div>
      <SidebarVariant title='Small Sidebar' size='small' />
      <SidebarVariant title='Medium Sidebar' size='medium' />
      <SidebarVariant title='Large Sidebar' size='large' />
    </div>
  )
}

export const ItemExample = ItemTemplate.bind({})
ItemExample.args = {
  icon: createHome
}

const SidebarSpacerVariant = (
  { spacer, collapsed }: { spacer: boolean, collapsed?: boolean }
): ReactElement => {
  const defaultProps = {
    _iconViewbox: 24,
    onPress: action('press')
  }

  return (
    <>
      <Sidebar logo={<Logo />} isCollapsed={collapsed}>
        <SidebarItem icon={createHome} {...defaultProps}>
          Home
        </SidebarItem>
        <SidebarItem icon={iconReport} {...defaultProps}>
          Reports
        </SidebarItem>
        {spacer && <SidebarSectionSpacer />}
        <SidebarItem icon={iconMail} {...defaultProps} badge='3'>
          Messages
        </SidebarItem>
        <SidebarItem icon={iconUser} {...defaultProps}>
          Profile
        </SidebarItem>
      </Sidebar>
    </>
  )
}

const SpacerCompare = ({ collapsed }: { collapsed?: boolean }): ReactElement => (
  <div className={`flex justify-between w-[768px] h-full bg-white overflow-y-auto`}>
    <SidebarSpacerVariant spacer collapsed={collapsed} />
    <SidebarSpacerVariant spacer={false} collapsed={collapsed} />
  </div>
)

export const SectionSpacerExample = (): ReactElement => {
  return (
    <div>
      <h2 className='text-body-lg-heavy mt-6 mb-2'>Normal</h2>
      <div className='h-[400px]'>
        <SpacerCompare />
      </div>
      <h2 className='text-body-lg-heavy mt-6 mb-2'>Small Height(200px)</h2>
      <div className='h-[240px]'>
        <SpacerCompare />
      </div>
      <h2 className='text-body-lg-heavy mt-6 mb-2'>Collapsed</h2>
      <div className='h-[400px]'>
        <SpacerCompare collapsed />
      </div>
    </div>
  )
}
