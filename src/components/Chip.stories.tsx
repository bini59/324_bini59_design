import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from './Chip';

const meta = { title: 'Components/Chip', component: Chip, args: { children: '전체' } } satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const AccentActive: Story = { args: { active: true, tone: 'accent' } };
export const Group: Story = {
  render: () => {
    const [v, setV] = useState('all');
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {[['all', '전체'], ['done', '체크함'], ['todo', '안 본 것']].map(([k, l]) => (
          <Chip key={k} active={v === k} onClick={() => setV(k)}>{l}</Chip>
        ))}
      </div>
    );
  },
};
