import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import AdPlaceholder from "./AdPlaceholder"

export default function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <AdPlaceholder slot="top" />
      <main id="main">
        <Outlet />
      </main>
      <AdPlaceholder slot="bottom" />
      <Footer />
    </div>
  )
}
