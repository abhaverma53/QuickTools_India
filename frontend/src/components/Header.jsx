import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { SITE_NAME, navItems } from "../data/tools"
import SearchBox from "./SearchBox"

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle("nav-open", open)
    return () => document.body.classList.remove("nav-open")
  }, [open])

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="logo" to="/" aria-label={`${SITE_NAME} home`}>
          <span className="logo-mark" aria-hidden="true">
            Q
          </span>
          <span className="logo-text">{SITE_NAME}</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-search">
          <SearchBox size="header" />
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="menu-lines" aria-hidden="true" />
        </button>
      </div>

      <div className={`mobile-panel ${open ? "is-open" : ""}`} id="mobile-nav">
        <nav aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <SearchBox size="mobile" />
      </div>
    </header>
  )
}
