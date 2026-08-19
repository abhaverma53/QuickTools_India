import { Link } from "react-router-dom"
import Seo from "../components/Seo"
import { SITE_NAME } from "../data/tools"

export default function TermsPage() {
  return (
    <article className="page legal-page">
      <Seo
        title={`Terms of Service | ${SITE_NAME}`}
        description="Terms for using QuickTools India calculators, image tools, PDF tools and generators."
        path="/terms"
      />
      <h1>Terms of Service</h1>
      <p>Last updated: 19 August 2026</p>
      <h2>Using the site</h2>
      <p>
        QuickTools India is provided as a free set of utilities. Tools are offered as-is, without a guarantee that a
        result will suit every file, device or purpose.
      </p>
      <h2>Your files</h2>
      <p>
        You are responsible for the files and text you process. Do not use the tools with content you are not allowed
        to copy or share. Keep your own copies of important files.
      </p>
      <h2>Availability</h2>
      <p>
        Features may change, and the site may be unavailable at times for maintenance or hosting issues.
      </p>
      <h2>Contact</h2>
      <p>
        For questions, use the <Link to="/contact">contact page</Link>.
      </p>
    </article>
  )
}
