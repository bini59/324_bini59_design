import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = { title: 'Components/Input', component: Input, args: { label: '이메일', placeholder: 'you@example.com' }, decorators: [(S) => <div style={{ width: 280 }}><S /></div>] } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hint: Story = { args: { hint: '로그인에 사용됩니다.' } };
export const Error: Story = { args: { error: '올바른 이메일이 아닙니다.', defaultValue: 'abc' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'disabled' } };
