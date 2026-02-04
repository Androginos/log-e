import { motion } from 'framer-motion';
import { useState } from 'react';
import EarthScene from './components/EarthScene';

function App() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Layer: 3D Earth Scene */}
      <EarthScene />

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
            placeholder="Track or Ask..."
            className="px-6 pr-12 py-2.5 bg-white/20 backdrop-blur-xl border border-white/30 
                     text-white placeholder:text-white/60 
                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                     transition-all duration-300
                     w-[90vw] max-w-[500px]
                     text-base font-medium
                     shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '2rem',
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
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
              mixBlendMode: 'overlay',
              borderRadius: '2rem',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
