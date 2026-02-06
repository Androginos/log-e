import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LangProvider } from './context/LangContext'
import { TrackingProvider } from './context/TrackingContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <TrackingProvider>
        <App />
      </TrackingProvider>
    </LangProvider>
  </StrictMode>,
)
