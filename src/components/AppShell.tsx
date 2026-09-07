import type { ReactNode } from 'react';

// 321_auth/packages/contracts 재선언 (private 패키지). GET /me 응답과 동일.
export type Membership = { role: string; status: string; joinedAt: string };
export type AuthenticatedUser = {
  userId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  membership: Membership | null;
};

export type NavItem = { id: string; label: string; icon?: ReactNode; href?: string };

export type AppShellProps = {
  brand: { mark: ReactNode; name: string; host?: string };
  nav: NavItem[];
  activeId: string;
  /** 앱 Router Link 주입. 없으면 <a href>. 반환한 엘리먼트가 nav-item 스타일을 그대로 받는다. */
  renderLink?: (item: NavItem, children: ReactNode) => ReactNode;
  user: AuthenticatedUser | null;
  onLogout: () => void;
  crumb: ReactNode;
  topbarActions?: ReactNode;
  /** ThemeToggle 등 */
  sidebarFoot?: ReactNode;
  children: ReactNode;
};

const NAV_ITEM = 'flex w-full items-center gap-[9px] rounded-md px-2 py-[7px] text-left text-[13.5px] cursor-pointer border-0 bg-transparent text-fg-2 hover:bg-panel-2 hover:text-fg [&_a]:text-inherit [&_a]:no-underline';
const NAV_ACTIVE = 'bg-panel-2 text-fg';

export function UserAvatar({ user, className = '' }: { user: AuthenticatedUser | null; className?: string }) {
  const label = user?.name ?? user?.email ?? '';
  return (
    <div
      className={`grid size-7 flex-none place-items-center overflow-hidden rounded-full border border-line bg-panel-2 text-[11.5px] font-semibold text-fg-2 ${className}`}
      title={label || undefined}
    >
      {user?.avatarUrl ? <img src={user.avatarUrl} alt={label} className="block size-full object-cover" /> : (label || '?').slice(0, 2).toUpperCase()}
    </div>
  );
}

export function Sidebar({ brand, nav, activeId, renderLink, onLogout, sidebarFoot }: Pick<AppShellProps, 'brand' | 'nav' | 'activeId' | 'renderLink' | 'onLogout' | 'sidebarFoot'>) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[238px] flex-none flex-col border-r border-line bg-panel px-3 py-3.5 min-[880px]:flex">
      <div className="flex items-center gap-[9px] px-1.5 pt-1">
        <div className="grid size-6 place-items-center rounded-md bg-fg text-xs font-bold text-bg">{brand.mark}</div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">{brand.name}</span>
          {brand.host && <span className="font-mono text-[10.5px] text-fg-3">{brand.host}</span>}
        </div>
      </div>
      <nav className="mt-5 grid gap-0.5">
        {nav.map((item) => {
          const active = item.id === activeId;
          const cls = `${NAV_ITEM} ${active ? NAV_ACTIVE : ''}`;
          const inner = <>{item.icon}{item.label}</>;
          return renderLink ? (
            <div key={item.id} className={`${cls} p-0 [&>*]:flex [&>*]:w-full [&>*]:items-center [&>*]:gap-[9px] [&>*]:px-2 [&>*]:py-[7px]`}>{renderLink(item, inner)}</div>
          ) : (
            <a key={item.id} href={item.href ?? '#'} aria-current={active ? 'page' : undefined} className={`${cls} text-fg-2 no-underline hover:no-underline`}>{inner}</a>
          );
        })}
      </nav>
      <div className="flex-1" />
      <div className="grid gap-2.5 border-t border-line pt-3">
        {sidebarFoot}
        <button type="button" onClick={onLogout} className={NAV_ITEM}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          로그아웃
        </button>
      </div>
    </aside>
  );
}

export function Topbar({ crumb, children, user }: { crumb: ReactNode; children?: ReactNode; user: AuthenticatedUser | null }) {
  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center gap-3.5 border-b border-line bg-bg px-[22px]">
      <div className="flex items-center gap-2 text-[13px] text-fg-3 [&_strong]:font-medium [&_strong]:text-fg">{crumb}</div>
      <span className="flex-1" />
      {children}
      <UserAvatar user={user} />
    </header>
  );
}

export function AppShell({ brand, nav, activeId, renderLink, user, onLogout, crumb, topbarActions, sidebarFoot, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar brand={brand} nav={nav} activeId={activeId} renderLink={renderLink} onLogout={onLogout} sidebarFoot={sidebarFoot} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar crumb={crumb} user={user}>{topbarActions}</Topbar>
        <main className="w-full max-w-[1240px] flex-1 px-[22px] pt-[26px] pb-[60px]">{children}</main>
      </div>
    </div>
  );
}
