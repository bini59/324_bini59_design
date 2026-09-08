# @bini59/design

개인 프로젝트 공용 디자인 시스템. Tailwind v4 + React. 토큰은 CSS 변수(`data-theme="light|dark"`)로 두고 `@theme inline`으로 Tailwind에 노출한다.

- 토큰: `src/tokens/theme.css` — 321_auth admin 토큰 기준
- Tailwind 매핑: `src/base.css` — `bg-bg text-fg-2 border-line bg-accent/10 rounded-pill` 처럼 사용
- 서체: Pretendard (317_gbc_seoko와 동일)
- 문서: `pnpm dev` → Storybook :6006

## 소비 앱에서 쓰기

dist 없이 소스 그대로 GitHub 의존성으로 가져온다. 컴포넌트가 Tailwind 클래스로 쓰여 있어 소비 앱의 Tailwind가 이 패키지 소스를 스캔해야 한다.

```jsonc
// package.json
"@bini59/design": "github:bini59/324_bini59_design#v0.1.0"
```
```css
/* app.css */
@import "@bini59/design/src/base.css";
@source "../node_modules/@bini59/design/src";
```
```ts
import { Button } from '@bini59/design';
```

테마(라이트/다크/시스템): `<ThemeToggle />`를 `AppShell`의 `sidebarFoot`에 두면 `localStorage.theme` + `<html data-theme>`로 동작한다. 첫 로드 깜빡임 방지는 index.html `<head>`에 `<script>${THEME_SCRIPT}</script>` 인라인.

```sh
nvm use   # Node 22
pnpm i
pnpm dev
pnpm build      # storybook-static/
pnpm typecheck
```
