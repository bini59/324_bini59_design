import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = { title: 'Components/Badge', component: Badge, args: { children: 'active' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge>neutral</Badge><Badge tone="ok">ok</Badge><Badge tone="warn">warn</Badge><Badge tone="danger">danger</Badge><Badge tone="accent">accent</Badge>
    </div>
  ),
};
