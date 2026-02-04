export type Lang = 'TR' | 'EN' | 'DE';

export const translations = {
  TR: {
    searchPlaceholder: 'Takip et veya Sor...',
    menuContent1: 'İçerik 1',
    menuContent2: 'İçerik 2',
    menuContent3: 'İçerik 3',
    menuContent4: 'İçerik 4',
    langLabel: 'TR',
  },
  EN: {
    searchPlaceholder: 'Track or Ask...',
    menuContent1: 'Content 1',
    menuContent2: 'Content 2',
    menuContent3: 'Content 3',
    menuContent4: 'Content 4',
    langLabel: 'EN',
  },
  DE: {
    searchPlaceholder: 'Verfolgen oder Fragen...',
    menuContent1: 'Inhalt 1',
    menuContent2: 'Inhalt 2',
    menuContent3: 'Inhalt 3',
    menuContent4: 'Inhalt 4',
    langLabel: 'DE',
  },
} as const;
