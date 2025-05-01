
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set initial theme class before rendering to prevent flash of wrong theme
const setInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.add('theme-dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('theme-light');
  }
};

setInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
