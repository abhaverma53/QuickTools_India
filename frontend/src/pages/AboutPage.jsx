import Seo from "../components/Seo"
import { SITE_NAME, TAGLINE } from "../data/tools"

export default function AboutPage() {
  return (
    <article className="page legal-page">
      <Seo
        title={`About | ${SITE_NAME}`}
        description="QuickTools India offers simple, fast, mobile-friendly calculators, image tools, PDF tools and generators."
        path="/about"
      />
      <h1>About</h1>
      <p>
        {SITE_NAME} is a small collection of everyday utilities: calculators, image tools, PDF tools and generators.
        The aim is to stay fast, easy to use on a phone, and free for common tasks.
      </p>
      <p>{TAGLINE}</p>
      <p>
        Image and PDF tools are designed to run in your browser wherever possible, so you do not need an account to
        compress a photo or build a PDF.
      </p>
    </article>
  )
}
