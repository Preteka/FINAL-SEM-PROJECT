import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './shared/context/AuthContext'
import { CartProvider } from './shared/context/CartContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    </StrictMode>,
)
