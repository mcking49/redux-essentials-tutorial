import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { worker } from './api/server'
import store from './app/store'
import { extendedApiSlice } from './features/users/users-slice'
import './index.css'

async function start() {
  await worker.start({ onUnhandledRequest: 'bypass' })

  void store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
    // </React.StrictMode>,
  )
}

void start()
