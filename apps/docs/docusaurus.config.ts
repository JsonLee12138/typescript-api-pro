import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'TypeScript API Pro',
  tagline: 'A comprehensive TypeScript type utility library',
  // favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://jsonlee12138.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/typescript-api-pro/',

  // GitHub Pages 配置
  trailingSlash: true,  // 修复 GitHub Pages 警告

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'JsonLee12138', // Usually your GitHub org/user name.
  projectName: 'typescript-api-pro', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to set this to "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      'en': {
        label: 'English',
      },
      'zh-Hans': {
        label: '简体中文',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/JsonLee12138/typescript-api-pro/tree/main/apps/docs/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'TypeScript API Pro',
      // logo: {
      //   alt: 'TypeScript API Pro Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/examples', label: 'Examples', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/JsonLee12138/typescript-api-pro',
          label: 'GitHub',
          position: 'right',
        },
        {
          label: 'npm',
          position: 'right',
          href: 'https://www.npmjs.com/package/typescript-api-pro',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/JsonLee12138/typescript-api-pro',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/JsonLee12138/typescript-api-pro/issues',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/666U6JTCQY',
            },
            {
              label: 'QQ社区',
              href: 'https://pd.qq.com/s/fjwy3eo20?b=9',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Examples',
              to: '/examples',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/JsonLee12138/typescript-api-pro',
            },
            {
              label: 'NPM',
              href: 'https://www.npmjs.com/package/typescript-api-pro',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TypeScript API Pro. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
