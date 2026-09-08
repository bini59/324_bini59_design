import type { Preview } from '@storybook/react-vite';
import '../src/base.css';
import { resolveTheme } from '../src/components/ThemeToggle';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '테마',
      toolbar: { icon: 'mirror', items: ['light', 'dark', 'system'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, ctx) => {
      document.documentElement.setAttribute('data-theme', resolveTheme(ctx.globals.theme));
      return <Story />;
    },
  ],
  parameters: { layout: 'centered' },
};
export default preview;
