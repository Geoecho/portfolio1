import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import PrivacyPolicy from './components/PrivacyPolicy'
import './index.css'
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/work-sans'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/^\/privacy\/?$/.test(window.location.pathname) ? <PrivacyPolicy /> : <App />}
  </React.StrictMode>,
)
