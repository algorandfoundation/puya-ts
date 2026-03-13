// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import remarkGithubAlerts from 'remark-github-alerts'
import starlightTypeDoc from 'starlight-typedoc'
import sidebarConfig from './sidebar.config.json'

// https://astro.build/config
export default defineConfig({
  site: 'https://algorandfoundation.github.io',
  base: '/algorand-typescript/',
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
  },
  integrations: [
    starlight({
      title: 'Algorand TypeScript',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/algorandfoundation/puya-ts' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/algorand' },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: [
            '../packages/algo-ts/src/index.ts',
            '../packages/algo-ts/src/op.ts',
            '../packages/algo-ts/src/itxn.ts',
            '../packages/algo-ts/src/gtxn.ts',
            '../packages/algo-ts/src/arc4/index.ts',
          ],
          tsconfig: '../packages/algo-ts/tsconfig.json',
          output: 'api',
          sidebar: {
            label: 'API Reference',
            collapsed: true,
          },
          typeDoc: {
            excludeReferences: true,
            gitRevision: 'main',
            entryFileName: 'index',
          },
        }),
      ],
      sidebar: sidebarConfig,
    }),
  ],
})
