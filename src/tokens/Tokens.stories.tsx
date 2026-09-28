import type { Meta, StoryObj } from '@storybook/react-vite';

const COLORS = ['bg', 'panel', 'panel-2', 'raise', 'border', 'border-strong', 'fg', 'fg-2', 'fg-3', 'accent', 'accent-soft', 'ok', 'warn', 'danger', 'danger-soft'];
const RADII = ['radius-sm', 'radius', 'radius-lg', 'radius-xl', 'radius-pill'];
const SCALES = ['grey', 'blue', 'green', 'amber', 'red'];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const meta = { title: 'Tokens/Overview', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;

/** 팔레트 원본. 500 = 기준색(버튼 배경), 50 = 틴트, 950 = 텍스트. */
export const Palette: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 14 }}>
      {SCALES.map((s) => (
        <div key={s} style={{ display: 'grid', gridTemplateColumns: `64px repeat(${STEPS.length}, 1fr)`, gap: 4, alignItems: 'center' }}>
          <code className="font-mono" style={{ fontSize: 11.5 }}>{s}</code>
          {STEPS.map((n) => (
            <div key={n} title={`--${s}-${n}`} style={{ display: 'grid', gap: 4, justifyItems: 'center' }}>
              <div style={{ width: '100%', height: 40, borderRadius: 6, background: `var(--${s}-${n})` }} />
              <span className="text-fg-3" style={{ fontSize: 10.5 }}>{n}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Colors: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
      {COLORS.map((c) => (
        <div key={c} className="rounded-lg border border-line bg-panel p-2.5 grid gap-1.5">
          <div style={{ height: 40, borderRadius: 6, background: `var(--${c})`, border: '1px solid var(--border)' }} />
          <code className="font-mono" style={{ fontSize: 11.5 }}>--{c}</code>
        </div>
      ))}
    </div>
  ),
};

export const Radius: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {RADII.map((r) => (
        <div key={r} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: `var(--${r})`, background: 'var(--panel-2)', border: '1px solid var(--border-strong)' }} />
          <code className="font-mono" style={{ fontSize: 11.5 }}>--{r}</code>
        </div>
      ))}
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em' }}>페이지 타이틀 21/600</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>카드 헤더 13/500</div>
      <div style={{ fontSize: 14 }}>본문 14/400 — Pretendard</div>
      <div className="text-fg-2" style={{ fontSize: 13 }}>보조 13 muted</div>
      <div className="text-fg-3" style={{ fontSize: 11.5 }}>메타 11.5 dim</div>
      <code className="font-mono">mono: sess_01HXYZ</code>
    </div>
  ),
};
