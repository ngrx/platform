export const ngrxTheme = {
  name: 'ngrx-theme',
  fg: '#abb2bf',
  bg: '#rgba(0, 0, 0, 0.24)',
  settings: [
    {
      name: 'Comments / Quotes',
      scope: ['comment', 'punctuation.definition.comment', 'markup.quote'],
      settings: { foreground: '#7d8595', fontStyle: 'italic' },
    },
    {
      name: 'Keywords / Doctags / Formula',
      scope: ['keyword', 'storage.type', 'storage.modifier', 'storage.control'],
      settings: { foreground: '#fface6' },
    },
    {
      name: 'Sections / Deletions / Tags / Function name',
      scope: [
        'entity.name.section',
        'markup.heading',
        'markup.deleted',
        'variable.language',
        'entity.name.function',
        'entity.name.tag',
      ],
      settings: { foreground: '#e06c75' },
    },
    {
      name: 'Literals',
      scope: ['constant.language', 'support.constant'],
      settings: { foreground: '#56b6c2' },
    },
    {
      name: 'Strings / Regex / Added / Attributes',
      scope: [
        'string',
        'string.regexp',
        'constant.character.escape',
        'markup.inserted',
        'entity.other.attribute-name',
        'string.template',
      ],
      settings: { foreground: '#98c379' },
    },
    {
      name: 'Numbers / Types / Classes / Vars',
      scope: [
        'constant.numeric',
        'variable.other.readwrite',
        'support.type',
        'support.class',
        'variable.other.constant',
      ],
      settings: { foreground: '#ffb871' },
    },
    {
      name: 'Symbols / Meta / Links',
      scope: [
        'entity.name.type',
        'meta.import',
        'meta.export',
        'markup.list.bullet',
        'markup.link',
        'string.other.link',
      ],
      settings: { foreground: '#61aeee' },
    },
    {
      name: 'Builtins / Class Titles',
      scope: [
        'support.function.builtin',
        'support.type.builtin',
        'entity.name.type.class',
        'meta.class',
      ],
      settings: { foreground: '#ffdcbe' },
    },
    {
      name: 'Emphasis',
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      name: 'Strong',
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
    {
      name: 'Underline Link',
      scope: ['markup.underline.link'],
      settings: { fontStyle: 'underline', foreground: '#61aeee' },
    },
    {
      name: 'Default',
      scope: ['source', 'text'],
      settings: { foreground: '#abb2bf' },
    },
  ],
};

// Light-theme counterpart, rendered alongside ngrxTheme via Shiki's dual-theme output
export const ngrxThemeLight = {
  name: 'ngrx-theme-light',
  fg: '#383a42',
  bg: '#f6f8fa',
  settings: [
    {
      name: 'Comments / Quotes',
      scope: ['comment', 'punctuation.definition.comment', 'markup.quote'],
      settings: { foreground: '#656670', fontStyle: 'italic' },
    },
    {
      name: 'Keywords / Doctags / Formula',
      scope: ['keyword', 'storage.type', 'storage.modifier', 'storage.control'],
      settings: { foreground: '#a626a4' },
    },
    {
      name: 'Sections / Deletions / Tags / Function name',
      scope: [
        'entity.name.section',
        'markup.heading',
        'markup.deleted',
        'variable.language',
        'entity.name.function',
        'entity.name.tag',
      ],
      settings: { foreground: '#8a5c00' },
    },
    {
      name: 'Literals',
      scope: ['constant.language', 'support.constant'],
      settings: { foreground: '#0997b3' },
    },
    {
      name: 'Strings / Regex / Added / Attributes',
      scope: [
        'string',
        'string.regexp',
        'constant.character.escape',
        'markup.inserted',
        'entity.other.attribute-name',
        'string.template',
      ],
      settings: { foreground: '#2f7d2e' },
    },
    {
      name: 'Numbers / Types / Classes / Vars',
      scope: [
        'constant.numeric',
        'variable.other.readwrite',
        'support.type',
        'support.class',
        'variable.other.constant',
      ],
      settings: { foreground: '#986801' },
    },
    {
      name: 'Symbols / Meta / Links',
      scope: [
        'entity.name.type',
        'meta.import',
        'meta.export',
        'markup.list.bullet',
        'markup.link',
        'string.other.link',
      ],
      settings: { foreground: '#2b5dd7' },
    },
    {
      name: 'Builtins / Class Titles',
      scope: [
        'support.function.builtin',
        'support.type.builtin',
        'entity.name.type.class',
        'meta.class',
      ],
      settings: { foreground: '#016a97' },
    },
    {
      name: 'Emphasis',
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      name: 'Strong',
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
    {
      name: 'Underline Link',
      scope: ['markup.underline.link'],
      settings: { fontStyle: 'underline', foreground: '#2b5dd7' },
    },
    {
      name: 'Default',
      scope: ['source', 'text'],
      settings: { foreground: '#383a42' },
    },
  ],
};
