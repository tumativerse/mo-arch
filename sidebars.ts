import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    'architecture/overview',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/decisions',
        'architecture/mo-journey',
        'architecture/mo-mind',
        'architecture/mo-journey-mind-summary',
      ],
    },
    {
      type: 'category',
      label: 'MO:SELF',
      link: { type: 'doc', id: 'mo-self/index' },
      items: [
        {
          type: 'category',
          label: 'MoIdentity',
          link: { type: 'doc', id: 'mo-self/mo-identity/index' },
          items: [
            'mo-self/mo-identity/mo-auth',
            'mo-self/mo-identity/mo-profile',
            'mo-self/mo-identity/mo-goals',
          ],
        },
        {
          type: 'category',
          label: 'MoPrefs',
          link: { type: 'doc', id: 'mo-self/mo-prefs/index' },
          items: [
            'mo-self/mo-prefs/mo-settings',
            'mo-self/mo-prefs/mo-gear',
            'mo-self/mo-prefs/mo-alerts',
          ],
        },
        {
          type: 'category',
          label: 'MoHistory',
          link: { type: 'doc', id: 'mo-self/mo-history/index' },
          items: [
            'mo-self/mo-history/mo-records',
            'mo-self/mo-history/mo-streaks',
            'mo-self/mo-history/mo-badges',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'MO:PULSE',
      link: { type: 'doc', id: 'mo-pulse/index' },
      items: [
        {
          type: 'category',
          label: 'MoMove',
          link: { type: 'doc', id: 'mo-pulse/mo-move/index' },
          items: [
            'mo-pulse/mo-move/mo-strength',
            'mo-pulse/mo-move/mo-session',
            'mo-pulse/mo-move/mo-warmup',
            'mo-pulse/mo-move/mo-cardio',
            'mo-pulse/mo-move/mo-mobility',
          ],
        },
        {
          type: 'category',
          label: 'MoBody',
          link: { type: 'doc', id: 'mo-pulse/mo-body/index' },
          items: [
            'mo-pulse/mo-body/mo-weight',
            'mo-pulse/mo-body/mo-measure',
            'mo-pulse/mo-body/mo-composition',
          ],
        },
        {
          type: 'category',
          label: 'MoRecover',
          link: { type: 'doc', id: 'mo-pulse/mo-recover/index' },
          items: [
            'mo-pulse/mo-recover/mo-sleep',
            'mo-pulse/mo-recover/mo-energy',
            'mo-pulse/mo-recover/mo-soreness',
            'mo-pulse/mo-recover/mo-strain',
          ],
        },
        {
          type: 'category',
          label: 'MoFuel',
          link: { type: 'doc', id: 'mo-pulse/mo-fuel/index' },
          items: [
            'mo-pulse/mo-fuel/mo-meals',
            'mo-pulse/mo-fuel/mo-macros',
            'mo-pulse/mo-fuel/mo-hydration',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'MO:COACH',
      link: { type: 'doc', id: 'mo-coach/index' },
      items: [
        {
          type: 'category',
          label: 'MoInsight',
          link: { type: 'doc', id: 'mo-coach/mo-insight/index' },
          items: [
            'mo-coach/mo-insight/mo-trends',
            'mo-coach/mo-insight/mo-reports',
            'mo-coach/mo-insight/mo-patterns',
          ],
        },
        {
          type: 'category',
          label: 'MoAdapt',
          link: { type: 'doc', id: 'mo-coach/mo-adapt/index' },
          items: [
            'mo-coach/mo-adapt/mo-fatigue',
            'mo-coach/mo-adapt/mo-progress',
            'mo-coach/mo-adapt/mo-deload',
            'mo-coach/mo-adapt/mo-suggest',
          ],
        },
        {
          type: 'category',
          label: 'MoChat',
          link: { type: 'doc', id: 'mo-coach/mo-chat/index' },
          items: [
            'mo-coach/mo-chat/mo-voice',
            'mo-coach/mo-chat/mo-advice',
            'mo-coach/mo-chat/mo-educate',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'MO:CONNECT',
      link: { type: 'doc', id: 'mo-connect/index' },
      items: [
        {
          type: 'category',
          label: 'MoCommunity',
          link: { type: 'doc', id: 'mo-connect/mo-community/index' },
          items: [
            'mo-connect/mo-community/mo-share',
            'mo-connect/mo-community/mo-challenges',
            'mo-connect/mo-community/mo-leaderboard',
          ],
        },
        {
          type: 'category',
          label: 'MoSync',
          link: { type: 'doc', id: 'mo-connect/mo-sync/index' },
          items: [
            'mo-connect/mo-sync/mo-wearables',
            'mo-connect/mo-sync/mo-health',
            'mo-connect/mo-sync/mo-apis',
          ],
        },
        {
          type: 'category',
          label: 'MoLibrary',
          link: { type: 'doc', id: 'mo-connect/mo-library/index' },
          items: [
            'mo-connect/mo-library/mo-exercises',
            'mo-connect/mo-library/mo-programs',
            'mo-connect/mo-library/mo-learn',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Implementation',
      items: [
        'mvp',
        'database/schema',
        'database/yaml-format',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/index',
        'api/ppl',
        'api/recovery',
        'api/progression',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/workflow',
        'development/quality-gates',
      ],
    },
    {
      type: 'category',
      label: 'Claude Code',
      link: { type: 'doc', id: 'claude-code/index' },
      items: [
        'claude-code/setup',
        'claude-code/onboarding',
        'claude-code/models',
        'claude-code/agents',
        'claude-code/skills-commands',
        'claude-code/rules-hooks',
        'claude-code/security',
        'claude-code/mcp-setup',
      ],
    },
  ],
};

export default sidebars;
