import { useEffect } from "react"
import { SITE_NAME, SITE_URL } from "../data/tools"

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement("meta")
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement("link")
    element.setAttribute("rel", rel)
    document.head.appendChild(element)
  }
  element.setAttribute("href", href)
}

export default function Seo({ title, description, path = "/" }) {
  const canonical = `${SITE_URL}${path}`
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  useEffect(() => {
    document.title = pageTitle
    upsertMeta('meta[name="description"]', { name: "description", content: description })
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle })
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description })
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical })
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" })
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" })
    upsertLink("canonical", canonical)
  }, [pageTitle, description, canonical])

  return null
}
