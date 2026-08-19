import { useEffect, useId, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchTools } from "../data/tools"

export default function SearchBox({ id, size = "header", onSearch }) {
  const navigate = useNavigate()
  const generatedId = useId()
  const inputId = id || generatedId
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const results = searchTools(query)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function submit(event) {
    event.preventDefault()
    if (onSearch) onSearch(query)
    if (results[0]) {
      navigate(results[0].path)
      setOpen(false)
    }
  }

  return (
    <form className={`search-box search-box-${size}`} onSubmit={submit} role="search" ref={wrapperRef}>
      <label className="sr-only" htmlFor={inputId}>
        Search for a tool
      </label>
      <input
        id={inputId}
        type="search"
        autoComplete="off"
        placeholder="Search for a tool..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          onSearch?.(event.target.value)
        }}
        onFocus={() => setOpen(true)}
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
      />
      <button type="submit">Search</button>
      {open && query.trim() && (
        <ul className="search-results" role="listbox">
          {results.length === 0 ? (
            <li className="search-empty">No tools match “{query.trim()}”.</li>
          ) : (
            results.map((tool) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(tool.path)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <strong>{tool.name}</strong>
                  <span>{tool.categoryLabel}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </form>
  )
}
