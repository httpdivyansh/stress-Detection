import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { createBrowserRouter, createRoutesFromElements, Route, Router, RouterProvider } from 'react-router-dom'
import Layout from './Layout.tsx'
import Home from './components/Home.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
const { VITE_CLERK_PUBLISHABLE_KEY } = import.meta.env
const publishablekey = VITE_CLERK_PUBLISHABLE_KEY

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home/>}></Route>
      <Route path='/App' element={<App/>}></Route>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishablekey}>
    <RouterProvider router={router}></RouterProvider>
    </ClerkProvider>
  </StrictMode>,
)