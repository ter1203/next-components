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

function StatCardsBySize(props: StatCardProps & { subject: string }) {
  const { subject, ...cardProps } = props
  return (
    <>
      <h2 className='text-md font-bold text-center my-4'>{subject}</h2>
      <section className='flex justify-around items-baseline'>
        <StatCard {...cardProps} size='small' />
        <StatCard {...cardProps} size='medium' />
        <StatCard {...cardProps} size='large' />
      </section>
    </>
  )
}

function PossibleStatCards(props: StatCardProps) {
  const props1 = { title: props.title }
  const props2 = {
    title: props.title,
    description: props.description
  }
  const props3 = {
    title: props.title,
    icon: props.icon
  }
  const props4 = {
    title: props.title,
    description: props.description,
    icon: props.icon
  }
  const props5 = {
    title: props.title,
    badgeLabel: '+40%'
  }
  const props6 = {
    title: props.title,
    badgeLabel: '+40%',
    icon: props.icon
  }
  const props7 = {
    title: props.title,
    badgeLabel: '+40%',
    description: props.description,
    icon: props.icon
  }
  const props8 = {
    title: props.title,
    badgeLabel: '+40%',
    description: props.description,
    icon: props.icon,
    trend: props.trend
  }

  return (
    <div className='flex flex-col w-[800px]'>
      <StatCardsBySize
        subject='Title only'
        {...props1}
      />

      <StatCardsBySize
        subject='Title and description'
        {...props2}
      />

      <StatCardsBySize
        subject='Title and icon'
        {...props3}
      />

      <StatCardsBySize
        subject='Title, description and icon'
        {...props4}
      />

      <StatCardsBySize
        subject='Title and badge'
        {...props5}
      />

      <StatCardsBySize
        subject='Title, icon and badge'
        {...props6}
      />

      <StatCardsBySize
        subject='Title, icon, description and badge'
        {...props7}
      />

      <StatCardsBySize
        subject='With variant = positive'
        {...props7}
        variant='positive'
      />

      <StatCardsBySize
        subject='With variant = negative'
        {...props7}
        variant='negative'
      />

      <StatCardsBySize
        subject='With trend'
        {...props8}
      />

      <StatCardsBySize
        subject='With variant and trend'
        {...props8}
        variant='positive'
      />

      <StatCardsBySize
        subject='With onPress'
        {...props}
      />

      <StatCardsBySize
        subject='With tooltip'
        {...props8}
        tooltip='This is a tooltip'
      />
    </div>
  )
}

const PossibleStatCardsTemplate: Story<StatCardProps> = (props: StatCardProps) => (
  <PossibleStatCards {...props} />
)

export const PossibleExamples = PossibleStatCardsTemplate.bind({})
PossibleExamples.args = {
  icon: svgGithub,
  title: '+ $200M',
  description: '45% this week',
  trend: [1, 8, 30, 45, 50],
  onPress: action('press'),
  badgeLabel: '+10',
  variant: 'positive'
}