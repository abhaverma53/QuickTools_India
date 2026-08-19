import { Link } from "react-router-dom"
import { getRelatedTools } from "../data/tools"

export default function RelatedTools({ slug }) {
  const related = getRelatedTools(slug)
  return (
    <section className="panel" aria-labelledby="related-heading">
      <h2 id="related-heading">Related tools</h2>
      <ul className="related-list">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link to={tool.path}>{tool.name}</Link>
            <span>{tool.summary}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
