import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import EarthScene from './components/EarthScene';
import { useLang } from './context/LangContext';
import { type Lang, translations } from './i18n/translations';

const LANGUAGES: Lang[] = ['TR', 'EN', 'DE'];

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

function App() {
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLang();

  const menuItems = [t.menuContent1, t.menuContent2, t.menuContent3, t.menuContent4];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Layer: 3D Earth Scene */}
      <EarthScene />

      {/* Top Right: Language Dropdown + Hamburger Menu */}
      <div className="absolute top-8 right-6 flex flex-col items-end gap-0 z-[30]" ref={langDropdownRef}>
        <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen(false);
              setLangDropdownOpen((o) => !o);
            }}
            className="flex items-center justify-center gap-1 w-11 h-11 text-base font-semibold font-exo text-white/90
              hover:opacity-90 transition-all duration-200"
          >
            <span>{translations[lang].langLabel}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Hamburger Menu Button */}
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

        {/* Shared dropdown area - same top level for both */}
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

      {/* Click outside to close menus */}
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

      {/* Top Layer: Temporary Text */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pt-[13rem] pointer-events-none z-[15]">
        <motion.p
          className="text-white/60 text-base font-light tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          LOREM IPSUM
        </motion.p>
      </div>

      {/* Middle Layer: LOGE Typography */}
      <div className="absolute inset-0 flex justify-center pointer-events-none z-[5]" style={{ top: '12%' }}>
        <motion.h1
          className="font-exo font-black italic text-[clamp(2.5rem,8vw,6.5rem)] leading-none tracking-tight"
          style={{
            color: '#FAF9F6',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            whiteSpace: 'nowrap',
            fontWeight: 800,
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        >
          LOG-E
        </motion.h1>
      </div>

      {/* Bottom HUD Input Field */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-12 z-[20]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="px-6 pr-12 py-2.5 text-white placeholder:text-white/60 
                     focus:outline-none focus:ring-2 focus:ring-white/30
                     transition-all duration-300
                     w-[90vw] max-w-[500px]
                     text-base font-medium"
            style={{
              ...glassyStyle,
              paddingLeft: '1.5rem',
              paddingRight: '3rem',
            }}
          />
          {/* Search Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/60"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          {/* Gloss effect overlay */}
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
