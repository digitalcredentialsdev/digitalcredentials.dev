// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Digital Credentials API',
  tagline: "The Digital Credentials API is a W3C incubation project to bring a secure and user friendly Web Platform API to request identity attributes from a user's digital identity wallet, similar to WebAuthn for passkeys.",
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://digitalcredentials.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'digitalcredentialsdev', // Usually your GitHub org/user name.
  projectName: 'digitalcredentials.dev', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/digitalcredentialsdev/dev.digitalcredentials.dev/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/digitalcredentialsdev/digitalcredentials.dev/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Digital Credentials API',
      logo: {
        alt: 'Identity card icon',
        src: 'img/digital-id.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        { href: "https://test.digitalcredentials.dev", label: 'Test Verifier', position: 'left' },
        { href: "https://w3c-fedid.github.io/digital-credentials/", label: 'Spec', position: 'left' },
        { href: "https://github.com/orgs/digitalcredentialsdev/discussions", label: 'Discussions', position: 'left' },
        {
          href: 'https://github.com/digitalcredentialsdev/digitalcredentials.dev',
          label: 'Source',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [

      ],
      copyright: `digitalcredentials.dev is a resource of the Digital Credentials work item at the W3C WICG`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    }
  }
};

export default config;
