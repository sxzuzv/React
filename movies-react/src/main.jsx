import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App.jsx'
import { WishProvider } from './useWish.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <WishProvider>
        <App />
      </WishProvider>
    </BrowserRouter>
  </StrictMode>
)
