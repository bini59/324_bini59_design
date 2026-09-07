# @bini59/design

개인 프로젝트 공용 디자인 시스템. Tailwind v4 + React. 토큰은 CSS 변수(`data-theme="light|dark"`)로 두고 `@theme inline`으로 Tailwind에 노출한다.

- 토큰: `src/tokens/theme.css` — 321_auth admin 토큰 기준
- Tailwind 매핑: `src/base.css` — `bg-bg text-fg-2 border-line bg-accent/10 rounded-pill` 처럼 사용
- 서체: Pretendard (317_gbc_seoko와 동일)
- 문서: `pnpm dev` → Storybook :6006

소비 앱에서는 `@import "@bini59/design/src/base.css"` 한 줄로 토큰·Tailwind 테마·기본 스타일이 들어온다.

```sh
nvm use   # Node 22
pnpm i
pnpm dev
pnpm build      # storybook-static/
pnpm typecheck
```
