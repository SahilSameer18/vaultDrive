import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { SearchProvider } from './context/SearchContext.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <SearchProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SearchProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
