import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NFIDW, Plug } from '@nfid/identitykit'
import { IdentityKitProvider } from '@nfid/identitykit/react'

createRoot(document.getElementById('root')).render(
  
  <IdentityKitProvider signers={[NFIDW,Plug]}>
    <App />
  </IdentityKitProvider>
)
