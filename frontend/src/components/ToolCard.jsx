import { Link } from "react-router-dom"

export default function ToolCard({ tool }) {
  return (
    <article className="tool-card">
      <p className="eyebrow">{tool.categoryLabel}</p>
      <h3>
        <Link to={tool.path}>{tool.name}</Link>
      </h3>
      <p>{tool.summary}</p>
      <Link className="text-link" to={tool.path}>
        Open tool
      </Link>
    </article>
  )
}
