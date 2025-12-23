import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Mo Architecture',
  tagline: 'Technical documentation for Mo Universe',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://mo-arch.tumati.me',
  baseUrl: '/',

  organizationName: 'tumativerse',
  projectName: 'mo-arch',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/tumativerse/mo-app/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Mo Architecture',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://modocs.tumati.me',
          label: 'Knowledge Base',
          position: 'left',
        },
        {
          href: 'https://github.com/tumativerse/mo-app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Architecture',
              to: '/',
            },
            {
              label: 'MVP Progress',
              to: '/mvp',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
          ],
        },
        {
          title: 'Related',
          items: [
            {
              label: 'Mo Knowledge Base',
              href: 'https://modocs.tumati.me',
            },
            {
              label: 'Mo App',
              href: 'https://mo.tumati.me',
            },
          ],
        },
        {
          title: 'Source',
          items: [
            {
              label: 'mo-app',
              href: 'https://github.com/tumativerse/mo-app',
            },
            {
              label: 'mo-docs',
              href: 'https://github.com/tumativerse/mo-docs',
            },
          ],
        },
      ],
      copyright: `Mo Universe © ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
