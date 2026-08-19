import { useEffect } from "react"
import { SITE_NAME } from "../data/tools"

export default function Faq({ items, path }) {
  useEffect(() => {
    const existing = document.getElementById("faq-schema")
    if (existing) existing.remove()
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "faq-schema"
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
      name: SITE_NAME,
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [items, path])

  return (
    <section className="panel" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently asked questions</h2>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
