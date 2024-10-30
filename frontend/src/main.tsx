
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Joinroom from './components/Joinroom.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div >hello</div>,
  },
  {
    path: "/room",
    element: <Joinroom />,
  },
]);
createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
