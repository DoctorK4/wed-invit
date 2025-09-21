import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import AppV2 from './components/AppV2.tsx'
import './index.css'

const base = import.meta.env.BASE_URL
const basename = base === '/' ? '/' : base.replace(/\/+$/, '')

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/v2',
      element: <AppV2 />,
    },
  ],
  {
    basename,
  },
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
