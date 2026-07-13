import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Diagnostic Error Banner for Remote Debugging
if (typeof window !== 'undefined') {
  const showBanner = (msg, color) => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.background = color;
    div.style.color = '#fff';
    div.style.padding = '12px';
    div.style.zIndex = '999999';
    div.style.fontSize = '13px';
    div.style.fontWeight = 'bold';
    div.style.wordBreak = 'break-all';
    div.style.boxShadow = '0 -4px 16px rgba(0,0,0,0.2)';
    div.innerText = msg;
    document.body.appendChild(div);
  };

  window.onerror = (message, source, lineno, colno, error) => {
    showBanner(`🔴 error: ${message} at ${source}:${lineno}:${colno}`, '#dc2626');
  };

  window.onunhandledrejection = (event) => {
    showBanner(`⚠️ promise rejection: ${event.reason}`, '#d97706');
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
