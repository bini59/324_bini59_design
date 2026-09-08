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

export const WithSubmenus: Story = {
  args: {
    nav: [
      { id: 'overview', label: '개요', href: '#overview' },
      { id: 'users', label: '사용자', href: '#users', children: [
        { id: 'all-users', label: '전체 사용자', href: '#all-users' },
        { id: 'invitations', label: '초대 관리', href: '#invitations' },
      ] },
      { id: 'apps', label: '앱', href: '#apps' },
      { id: 'settings', label: '설정', href: '#settings', children: [
        { id: 'general', label: '일반', href: '#general' },
        { id: 'permissions', label: '권한', href: '#permissions' },
      ] },
    ],
    activeId: 'invitations',
    crumb: <><span>Auth Admin</span><span>/</span><span>사용자</span><span>/</span><strong>초대 관리</strong></>,
    children: <Card title="초대 관리">본문</Card>,
  },
};
export const WithSubmenusCustomLink: Story = {
  args: { ...WithSubmenus.args, renderLink: CustomLink.args!.renderLink },
};


/** 인증 없는 공개 사이트: user/onLogout 생략 → 사이드바 로그아웃, 톱바 아바타 없음. */
export const PublicNoAuth: Story = {
  args: {
    brand: { mark: 'G', name: '원정가고싶다', href: '#home' },
    user: undefined,
    onLogout: undefined,
    crumb: <strong>라이브 캘린더</strong>,
    children: <Card title="라이브 캘린더">본문</Card>,
  },
  play: async ({ canvasElement }) => {
    const check = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
    check(!canvasElement.querySelector('button[aria-haspopup="menu"]'), '프로필 메뉴 없음');
    check(![...canvasElement.querySelectorAll('button')].some((b) => b.textContent?.includes('로그아웃')), '로그아웃 버튼 없음');
    check(canvasElement.querySelector<HTMLAnchorElement>('a[href="#home"]')?.textContent?.includes('원정가고싶다') === true, '브랜드 링크');
  },
};

/** 880px 미만 drawer. 데스크탑 사이드바가 숨는 구간의 유일한 네비게이션. */
export const MobileDrawer: Story = {
  args: { ...PublicNoAuth.args, nav: WithSubmenus.args!.nav, activeId: 'invitations' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const check = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
    const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
    const trigger = canvasElement.querySelector<HTMLButtonElement>('button[aria-label="메뉴 열기"]')!;
    check(!!trigger, '햄버거 버튼 존재');
    trigger.click();
    await settle();
    const drawer = canvasElement.querySelector('[role="dialog"]')!;
    check(!!drawer, 'drawer 열림');
    check(!!drawer.querySelector('[aria-current="page"]'), '활성 항목 표시');
    check(document.body.style.overflow === 'hidden', '배경 스크롤 잠금');
    drawer.querySelector<HTMLAnchorElement>('a[href="#overview"]')!.click();
    await settle();
    check(!canvasElement.querySelector('[role="dialog"]'), '링크 클릭 시 닫힘');
    trigger.click();
    await settle();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    check(!canvasElement.querySelector('[role="dialog"]'), 'Escape 닫힘');
    check(document.body.style.overflow !== 'hidden', '닫히면 스크롤 복구');
  },
};
