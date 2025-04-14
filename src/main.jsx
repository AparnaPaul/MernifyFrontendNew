import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { ProductProvider } from './context/ProductContext'

export const server = "http://localhost:4000";
export const categories = [
  "smartphone", "shoes", "Home Appliances", "Smart Watch", "earbuds", "laptop", "tablet", "tshirt", "camera", "television", "refrigerator"]



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>

      <ProductProvider>
        <App />
      </ProductProvider>

    </ThemeProvider>

  </StrictMode>,
)
