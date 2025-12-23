import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Mo Universe',
      items: [
        'architecture/overview',
        'architecture/mo-self',
        'architecture/mo-pulse',
        'architecture/mo-coach',
        'architecture/mo-connect',
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
  ],
};

export default sidebars;
