import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from './Button';

const meta = { title: 'Components/Card', component: Card, decorators: [(S) => <div style={{ width: 360 }}><S /></div>] } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { title: '세션', children: '현재 기기에서 로그인되어 있습니다.' } };
export const WithFooter: Story = {
  args: { title: '프로필', children: '이름과 사진을 변경할 수 있습니다.', footer: <><span className="text-fg-3">마지막 수정 3일 전</span><span style={{ flex: 1 }} /><Button size="sm">수정</Button></> },
};
