import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux';
import App from './App.tsx'
import './assets/styles/index.css'
import store from "./stores/store.ts";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
        <App />
  </Provider>
  </StrictMode>,
)
