import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

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
  accountCenterUrl?: string;
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
  const avatarUrl = user?.avatarUrl && URL.canParse(user.avatarUrl) && new URL(user.avatarUrl).protocol === 'https:' ? user.avatarUrl : null;
  return (
    <div
      className={`grid size-7 flex-none place-items-center overflow-hidden rounded-full border border-line bg-panel-2 text-[11.5px] font-semibold text-fg-2 ${className}`}
      title={label || undefined}
    >
      {avatarUrl ? <img src={avatarUrl} referrerPolicy="no-referrer" alt={label} className="block size-full object-cover" /> : (label || '?').slice(0, 2).toUpperCase()}
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

const svgProps = { viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function ProfileMenu({ user, onLogout, accountCenterUrl = "https://auth.bini59.dev/client" }: { user: AuthenticatedUser; onLogout: () => void; accountCenterUrl?: string }) {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const restoreFocus = useRef(false); // 키보드로 닫을 때만 트리거로 포커스 복귀 (바깥 클릭은 클릭한 곳 유지)

  const displayName = user.name ?? user.email ?? "사용자";

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) triggerRef.current?.focus();
      restoreFocus.current = false;
      return;
    }
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocus.current = true;
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
      if (!items.length) return;
      const current = items.indexOf(document.activeElement as HTMLElement);
      const forward = event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey);
      event.preventDefault();
      items[(current + (forward ? 1 : -1) + items.length) % items.length].focus();
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const itemCls = "flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left text-[13px] no-underline hover:bg-panel-2 ";

  return (
    <div ref={containerRef} className="relative flex items-center gap-2.5 min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${displayName} 프로필 메뉴`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="flex min-w-0 items-center gap-2.5 rounded-full text-left"
      >
        <UserAvatar user={user} className="hover:border-line-strong" />
      </button>
      {open ? (
        <div id={menuId} className="absolute top-full right-0 z-40 mt-2 w-[232px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[10px] border border-line-strong bg-panel shadow-panel">
          <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
            <UserAvatar user={user} />
            <span className="grid min-w-0">
              <strong className="truncate text-[12.5px] font-semibold text-fg">{displayName}</strong>
              {user.email ? <span className="truncate text-[11px] text-fg-3">{user.email}</span> : null}
            </span>
          </div>
          <div ref={menuRef} role="menu" aria-label="프로필 메뉴" className="grid gap-0.5 p-1.5">
            <a role="menuitem" href={accountCenterUrl} target="_blank" rel="noreferrer noopener" onClick={() => setOpen(false)} className={itemCls + "text-fg-2 hover:text-fg"}>
              <svg {...svgProps} className="shrink-0"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
              <span>계정센터<span className="sr-only"> (새 창)</span></span>
              <svg {...svgProps} width={13} height={13} className="ml-auto shrink-0 text-fg-3"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
            </a>
            <button role="menuitem" type="button" onClick={() => { setOpen(false); onLogout(); }} className={itemCls + "text-danger hover:bg-danger/10"}>
              <svg {...svgProps} className="shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({ crumb, children, user, onLogout, accountCenterUrl }: { crumb: ReactNode; children?: ReactNode; user: AuthenticatedUser | null; onLogout?: () => void; accountCenterUrl?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center gap-3.5 border-b border-line bg-bg px-[22px]">
      <div className="flex items-center gap-2 text-[13px] text-fg-3 [&_strong]:font-medium [&_strong]:text-fg">{crumb}</div>
      <span className="flex-1" />
      {children}
      {user && onLogout ? <ProfileMenu key={user.userId} user={user} onLogout={onLogout} accountCenterUrl={accountCenterUrl} /> : <UserAvatar user={user} />}
    </header>
  );
}

export function AppShell({ brand, nav, activeId, renderLink, user, onLogout, crumb, topbarActions, sidebarFoot, accountCenterUrl, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar brand={brand} nav={nav} activeId={activeId} renderLink={renderLink} onLogout={onLogout} sidebarFoot={sidebarFoot} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar crumb={crumb} user={user} onLogout={onLogout} accountCenterUrl={accountCenterUrl}>{topbarActions}</Topbar>
        <main className="w-full max-w-[1240px] flex-1 px-[22px] pt-[26px] pb-[60px]">{children}</main>
      </div>
    </div>
  );
}
