import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true } });
try {
  const { Sidebar } = await server.ssrLoadModule('/src/components/AppShell.tsx');
  for (const custom of [false, true]) {
    const html = renderToStaticMarkup(createElement(Sidebar, {
      brand: { mark: 'A', name: 'Admin' },
      nav: [{ id: 'users', label: 'Users', children: [
        { id: 'invites', label: 'Invites', href: '#invites' },
      ] }, { id: 'empty', label: 'Empty', children: [] }],
      activeId: 'invites',
      onLogout() {},
      renderLink: custom ? (item, children) => createElement('a', { href: item.href }, children) : undefined,
    }));
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
    assert.match(html, /<a[^>]*href="#invites"[^>]*aria-current="page"/);
    assert.match(html, /bg-accent-soft text-accent font-medium/);
    assert.match(html, /ml-4 border-l border-line pl-2/);
    assert.match(html, /py-\[5px\]/);
    assert.equal((html.match(/<ul /g) ?? []).length, 2);
  }
  console.log('AppShell: default/custom links, active submenu and compact spacing passed');
} finally {
  await server.close();
}
