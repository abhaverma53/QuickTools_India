import { Link } from "react-router-dom"
import Seo from "../components/Seo"
import SearchBox from "../components/SearchBox"
import ToolCard from "../components/ToolCard"
import { SITE_NAME, TAGLINE, categories, getToolsByCategory, tools } from "../data/tools"

export default function HomePage() {
  const popular = tools.filter((tool) => tool.popular)

  return (
    <div className="page">
      <Seo
        title={`${SITE_NAME} - Simple tools for everyday life`}
        description="Useful calculators, image tools, PDF tools and generators — all in one place. Fast, mobile-friendly tools for everyday use in India."
        path="/"
      />
      <section className="hero">
        <p className="eyebrow">{SITE_NAME}</p>
        <h1>Everyday tools, simple and free.</h1>
        <p className="lede">
          Useful calculators, image tools, PDF tools and generators — all in one place.
        </p>
        <div className="hero-search">
          <SearchBox id="home-search" size="hero" />
        </div>
      </section>

      <h2 className="section-title">Popular tools</h2>
      <div className="card-grid">
        {popular.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <h2 className="section-title">Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <article className="category-card" key={category.slug}>
            <h2>
              <Link to={category.path}>{category.name}</Link>
            </h2>
            <p>{category.description}</p>
            <ul>
              {getToolsByCategory(category.slug).map((tool) => (
                <li key={tool.slug}>
                  <Link to={tool.path}>{tool.name}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="status-line">{TAGLINE}</p>
    </div>
  )
}
