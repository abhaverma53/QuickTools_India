import { Link } from "react-router-dom"
import Seo from "../components/Seo"
import { SITE_NAME } from "../data/tools"

export default function NotFoundPage() {
  return (
    <div className="page not-found">
      <Seo
        title={`Page not found | ${SITE_NAME}`}
        description="That page is not available on QuickTools India."
        path="/404"
      />
      <h1>Page not found</h1>
      <p>The page you requested is not in this site. Try the home page or search for a tool.</p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  )
}
