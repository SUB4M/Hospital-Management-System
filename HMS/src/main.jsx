import {ClerkProvider} from '@clerk/react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

const publishable_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if(!publishable_key){
  throw new Error('add your clerk publishable key to the .env file')
}

createRoot(document.getElementById('root')).render(

<ClerkProvider publishablekey={publishable_key}>
<BrowserRouter>
      <App />
</BrowserRouter>
    </ClerkProvider>
 
)