import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Wrapper from './components/Wrapper.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrapper>
    <App />
    </Wrapper>
  </StrictMode>,
)
