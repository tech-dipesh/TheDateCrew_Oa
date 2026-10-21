import "@fontsource-variable/inter"
import "@/globals.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import App from "@/App"
import Shell from "@/components/shell"
import Customer from "@/pages/customer"
import Customers from "@/pages/customers"
import ErrorPage from "@/pages/errorpage"
import Login from "@/pages/login"

const router = createBrowserRouter([
  {
    path: "/", element: <App />, errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <Login /> },
      { element: <Shell />, children: [ { index: true, element: <Customers /> }, { path: "customers/:id", element: <Customer /> } ] },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode> <RouterProvider router={router} /> </StrictMode>,
)
