import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Leva } from 'leva';
import EarthScene from './components/EarthScene';
import { useLang } from './context/LangContext';
import { type Lang, translations } from './i18n/translations';

const LANGUAGES: Lang[] = ['TR', 'EN', 'DE'];

const SCROLL_TRIGGER = 420; // px scroll sonrası header + glass tam açık

const glassyStyle = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.1) 100%)',
  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.25)',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: '9999px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
};

const dropdownPanelStyle = {
  background: 'rgba(255, 255, 255, 0.14)',
  border: '1px solid rgba(255, 255, 255, 0.28)',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
};

const aeroGlassStyle = {
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4)',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [levaOpen, setLevaOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { lang, setLang, t } = useLang();
  const menuItems = [t.menuContent1, t.menuContent2, t.menuContent3, t.menuContent4];

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const progress = clamp(scrollY / SCROLL_TRIGGER, 0, 1);
  const headerOpacity = progress;
  const glassTranslateY = (1 - progress) * 100;
  const scrollIndicatorOpacity = 1 - progress;
  const headerHeight = 56;
  const logeTopPercent = 22 - progress * 16;
  const logeScale = 0.42 + (1 - progress) * 0.58;

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Scroll spacer: sayfa kaydırılabilir olsun */}
      <div style={{ height: '200vh' }} aria-hidden="true" />

      {/* Sabit arka plan: Dünya */}
      <div className="fixed inset-0 z-0">
        <EarthScene />
      </div>

      {/* Globe ayarları: sol üstte, ana sayfadayken görünür (scroll ile kaybolur) */}
      <div
        className="fixed top-8 left-6 z-[35] flex flex-col items-start gap-2 transition-opacity duration-300"
        style={{
          opacity: scrollIndicatorOpacity,
          pointerEvents: progress > 0.5 ? 'none' : 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setLevaOpen((o) => !o)}
          className="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors p-0 min-w-0"
          aria-label="Globe ayarları"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </button>
        <AnimatePresence>
          {levaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg overflow-hidden shadow-xl"
              style={{
                ...dropdownPanelStyle,
                background: 'rgba(0, 0, 0, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                <span className="text-white/80 text-xs font-exo font-semibold">Globe Ayarları</span>
                <button
                  type="button"
                  onClick={() => setLevaOpen(false)}
                  className="text-white/60 hover:text-white p-1 rounded transition-colors"
                  aria-label="Kapat"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto" style={{ width: 280 }}>
                <Leva fill flat hideCopyButton collapsed />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header: scroll ile yukarıdan iner (menü + dil) */}
      <header
        className="fixed top-0 left-0 right-0 z-[30] flex items-center justify-center transition-opacity duration-200"
        style={{
          height: headerHeight,
          opacity: headerOpacity,
          pointerEvents: progress > 0.1 ? 'auto' : 'none',
        }}
      >
        <div className="absolute top-0 right-6 bottom-0 flex flex-col items-end gap-0 z-10" ref={langDropdownRef}>
          <div className="flex items-center gap-4 h-full">
            <div className="relative">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setLangDropdownOpen((o) => !o);
                }}
                className="flex items-center justify-center gap-1 w-11 h-11 text-base font-semibold font-exo text-white/90 hover:opacity-90 transition-all duration-200"
              >
                <span>{translations[lang].langLabel}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => {
                setLangDropdownOpen(false);
                setMenuOpen((o) => !o);
              }}
              className="flex items-center justify-center w-11 h-11 text-white/90 hover:opacity-90 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          <div className="relative w-full mt-1.5">
            <AnimatePresence mode="wait">
              {langDropdownOpen && (
                <motion.div
                  key="lang"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-0 w-11 overflow-hidden z-[31] flex flex-col items-stretch"
                  style={dropdownPanelStyle}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-11 h-11 flex items-center justify-center text-base font-semibold font-exo transition-colors
                        ${lang === l ? 'text-white bg-white/15' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                    >
                      {translations[l].langLabel}
                    </button>
                  ))}
                </motion.div>
              )}
              {menuOpen && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-0 min-w-[5.5rem] max-w-[5.5rem] overflow-hidden py-0.5 z-[31]"
                  style={dropdownPanelStyle}
                >
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-1.5 py-1 text-center text-base font-semibold font-exo text-white/90 hover:bg-white/10 hover:text-white transition-colors not-italic"
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {(menuOpen || langDropdownOpen) && (
        <div
          className="fixed inset-0 z-[25]"
          onClick={() => {
            setMenuOpen(false);
            setLangDropdownOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* LOG-E + motto: merkezden header ortasına birlikte kayar ve küçülür */}
      <div
        className="fixed left-1/2 flex flex-col justify-center items-center pointer-events-none z-[10]"
        style={{
          top: `${logeTopPercent}%`,
          transform: `translate(-50%, -50%) scale(${logeScale})`,
        }}
      >
        <h1
          className="font-exo font-black italic leading-none tracking-tight whitespace-nowrap"
          style={{
            color: '#FAF9F6',
            fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            fontWeight: 800,
          }}
        >
          LOG-E
        </h1>
        <motion.p
          className="text-white/60 font-light tracking-wide font-exo mt-0 text-base sm:text-lg md:text-xl"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          LOREM IPSUM
        </motion.p>
      </div>

      {/* Scroll down göstergesi: sağ üst, globe ile aynı hizada, çerçevesiz */}
      <div
        className="fixed top-8 right-6 z-[20] flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <span className="text-white/70 text-[10px] font-exo tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Aero glass panel: alttan yukarı açılır, üst kenarı aşağıda (responsive) */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[20] transition-transform duration-300 ease-out overflow-hidden"
        style={{
          height: '88vh',
          transform: `translateY(${glassTranslateY}%)`,
          ...aeroGlassStyle,
        }}
      >
        <div className="h-full overflow-auto scrollbar-hide p-6 sm:p-8 pt-10 pb-24 text-white/90">
          {/* 1. Hizmetler */}
          <section className="mb-14 sm:mb-16">
            <h2 className="font-exo font-bold text-xl sm:text-2xl text-white mb-4">Hizmetler</h2>
            <p className="font-exo font-light text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <ul className="mt-4 space-y-2 text-white/75 text-sm sm:text-base font-exo font-light">
              <li>• Hizmet bir</li>
              <li>• Hizmet iki</li>
              <li>• Hizmet üç</li>
            </ul>
          </section>

          {/* 2. Hakkında */}
          <section className="mb-14 sm:mb-16">
            <h2 className="font-exo font-bold text-xl sm:text-2xl text-white mb-4">Hakkında</h2>
            <p className="font-exo font-light text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          {/* 3. Neden Biz */}
          <section className="mb-14 sm:mb-16">
            <h2 className="font-exo font-bold text-xl sm:text-2xl text-white mb-4">Neden Biz</h2>
            <p className="font-exo font-light text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              Nulla facilisi morbi tempus iaculis urna. Eget nunc scelerisque viverra mauris in aliquam sem. Magna sit amet purus gravida quis blandit turpis cursus in.
            </p>
          </section>

          {/* 4. İletişim */}
          <section className="mb-14 sm:mb-16">
            <h2 className="font-exo font-bold text-xl sm:text-2xl text-white mb-4">İletişim</h2>
            <p className="font-exo font-light text-sm sm:text-base text-white/85 leading-relaxed max-w-xl mb-4">
              Bize ulaşın. Sorularınız için aşağıdaki kanalları kullanabilirsiniz.
            </p>
            <ul className="space-y-2 text-white/75 text-sm sm:text-base font-exo font-light">
              <li>E-posta: info@ornek.com</li>
              <li>Tel: +90 XXX XXX XX XX</li>
              <li>Adres: Örnek Mah. Örnek Sk. No: 1, Şehir</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Alt arama alanı - hero’da görünsün, scroll’da da kalabilir */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-12 z-[20] transition-opacity duration-300"
        style={{
          opacity: 1 - progress,
          pointerEvents: progress > 0.5 ? 'none' : 'auto',
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="px-6 pr-12 py-2.5 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 w-[90vw] max-w-[500px] text-base font-medium"
            style={{ ...glassyStyle, paddingLeft: '1.5rem', paddingRight: '3rem' }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div
            className="absolute inset-0 pointer-events-none rounded-[2rem]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 45%)',
              mixBlendMode: 'overlay',
              borderRadius: '9999px',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
