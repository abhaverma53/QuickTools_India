import Seo from "../components/Seo"
import ToolCard from "../components/ToolCard"
import { SITE_NAME, categories, getToolsByCategory } from "../data/tools"
import NotFoundPage from "./NotFoundPage"

export default function CategoryPage({ slug }) {
  const category = categories.find((item) => item.slug === slug)

  if (!category) return <NotFoundPage />

  const items = getToolsByCategory(category.slug)

  return (
    <div className="page">
      <Seo
        title={`${category.name} | ${SITE_NAME}`}
        description={category.description}
        path={category.path}
      />
      <header className="page-intro">
        <p className="eyebrow">Category</p>
        <h1>{category.name}</h1>
        <p className="lede">{category.description}</p>
      </header>
      <div className="card-grid">
        {items.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  )
}
