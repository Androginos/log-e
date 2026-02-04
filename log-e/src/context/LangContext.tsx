import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Lang, translations } from '../i18n/translations';

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof translations)[Lang];
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('EN');
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
