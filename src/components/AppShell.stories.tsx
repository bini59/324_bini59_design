import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell, type AuthenticatedUser } from './AppShell';
import { Button } from './Button';
import { Card } from './Card';

const user: AuthenticatedUser = {
  userId: 'u_1',
  email: 'kevin@bini59.dev',
  name: 'Kevin Lim',
  avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
  membership: { role: 'ADMIN', status: 'ACTIVE', joinedAt: '2025-01-01T00:00:00Z' },
};

const meta = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  args: {
    brand: { mark: 'A', name: 'Auth Admin', host: 'bini59.dev' },
    nav: [
      { id: 'overview', label: '개요', href: '#overview' },
      { id: 'users', label: '사용자', href: '#users' },
      { id: 'apps', label: '앱', href: '#apps' },
      { id: 'settings', label: '설정', href: '#settings' },
    ],
    activeId: 'users',
    user,
    onLogout: () => alert('logout'),
    crumb: <><span>Auth Admin</span><span>/</span><strong>사용자</strong></>,
    children: <Card title="사용자">본문</Card>,
  },
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoUser: Story = { args: { user: null } };
export const NoAvatar: Story = { args: { user: { ...user, avatarUrl: null } } };
export const WithActions: Story = { args: { topbarActions: <Button size="sm">새 앱</Button>, sidebarFoot: <Button variant="ghost" size="sm">테마</Button> } };
export const CustomLink: Story = { args: { renderLink: (item, children) => <a href={`#custom-${item.id}`}>{children}</a> } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } }, globals: { viewport: { value: 'mobile1' } } };

export const ProfilePopup: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!;
    const check = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
    const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
    trigger.click();
    await settle();
    const menu = canvasElement.querySelector('[role="menu"]')!;
    const items = menu.querySelectorAll<HTMLElement>('[role="menuitem"]');
    check(trigger.getAttribute('aria-expanded') === 'true', 'Profile opens');
    check(document.activeElement === items[0], 'Account center receives focus');
    check(items[0].getAttribute('href') === 'https://auth.bini59.dev/client', 'Account center URL');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    check(document.activeElement === items[1], 'Arrow keys move focus');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    check(!canvasElement.querySelector('[role="menu"]'), 'Escape closes popup');
    check(document.activeElement === trigger, 'Escape restores focus');
    trigger.click();
    await settle();
    canvasElement.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await settle();
    check(!canvasElement.querySelector('[role="menu"]'), 'Outside click closes popup');
    trigger.click();
    await settle();
  },
};
