import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { ProductProvider } from './context/ProductContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    
          <ProductProvider>
            <App />
          </ProductProvider>
 
    </ThemeProvider>

  </StrictMode>,
)
