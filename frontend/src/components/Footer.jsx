import { Link } from "react-router-dom"
import { SITE_NAME, TAGLINE, tools } from "../data/tools"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{SITE_NAME}</p>
          <p>{TAGLINE}</p>
        </div>
        <div>
          <h2>Tools</h2>
          <ul>
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link to={tool.path}>{tool.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} {SITE_NAME}. Everyday tools, kept simple.</p>
    </footer>
  )
}
