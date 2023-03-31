import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import { Provider } from 'react-redux'

import { worker } from './api/server'
import store from './app/store'

void worker.start({ onUnhandledRequest: 'bypass' })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
)
