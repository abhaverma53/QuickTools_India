import Seo from "./Seo"
import AdPlaceholder from "./AdPlaceholder"
import Faq from "./Faq"
import RelatedTools from "./RelatedTools"

export default function ToolLayout({ tool, faq, instructions, children }) {
  return (
    <div className="page tool-page">
      <Seo title={tool.title} description={tool.description} path={tool.path} />
      <header className="page-intro">
        <p className="eyebrow">{tool.categoryLabel}</p>
        <h1>{tool.name}</h1>
        <p className="lede">{tool.description}</p>
      </header>
      {children}
      <AdPlaceholder slot="content" />
      <section className="panel">
        <h2>How to use this tool</h2>
        {instructions}
      </section>
      <Faq items={faq} path={tool.path} />
      <RelatedTools slug={tool.slug} />
    </div>
  )
}
