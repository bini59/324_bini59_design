import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: '버튼' },
  argTypes: { variant: { control: 'select', options: ['default', 'primary', 'accent', 'danger', 'ghost'] }, size: { control: 'radio', options: ['md', 'sm'] } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
export const Accent: Story = { args: { variant: 'accent' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };
export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button>Default</Button><Button variant="primary">Primary</Button><Button variant="accent">Accent</Button>
      <Button variant="danger">Danger</Button><Button variant="ghost">Ghost</Button><Button size="sm">Small</Button><Button disabled>Disabled</Button>
    </div>
  ),
};
