import { useState } from "react"
import ToolLayout from "../components/ToolLayout"
import { getTool } from "../data/tools"
import { formatResultNumber, isWhatPercent, percentChange, percentOf } from "../utils/percentage"
import { parseNumber } from "../utils/format"

const tool = getTool("percentage-calculator")

const modes = [
  { id: "of", label: "What is X% of Y?" },
  { id: "is", label: "X is what % of Y?" },
  { id: "change", label: "Increase or decrease" },
]

const faq = [
  {
    question: "Can I use this for exam marks?",
    answer: "Yes. For “X is what % of Y?”, enter marks scored as X and total marks as Y.",
  },
  {
    question: "How do I check a discount or price rise?",
    answer: "Use Increase or decrease. Enter the old price and the new price to see the percentage change.",
  },
  {
    question: "Are the numbers sent to a server?",
    answer: "No. All percentage calculations happen in your browser.",
  },
]

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState("of")
  const [first, setFirst] = useState("")
  const [second, setSecond] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  function labels() {
    if (mode === "of") return { first: "Percentage (X)", second: "Number (Y)" }
    if (mode === "is") return { first: "Number (X)", second: "Total (Y)" }
    return { first: "Old value", second: "New value" }
  }

  function onSubmit(event) {
    event.preventDefault()
    const a = parseNumber(first, labels().first)
    const b = parseNumber(second, labels().second)
    if (a.error || b.error) {
      setError(a.error || b.error)
      setResult(null)
      return
    }

    if (mode === "of") {
      const value = percentOf(a.value, b.value)
      setError("")
      setResult({
        text: `${formatResultNumber(a.value)}% of ${formatResultNumber(b.value)} = ${formatResultNumber(value)}`,
      })
      return
    }

    if (mode === "is") {
      const output = isWhatPercent(a.value, b.value)
      if (output.error) {
        setError(output.error)
        setResult(null)
        return
      }
      setError("")
      setResult({
        text: `${formatResultNumber(a.value)} is ${formatResultNumber(output.value)}% of ${formatResultNumber(b.value)}`,
      })
      return
    }

    const output = percentChange(a.value, b.value)
    if (output.error) {
      setError(output.error)
      setResult(null)
      return
    }
    const word = output.increased ? "Increase" : "Decrease"
    setError("")
    setResult({
      text: `${word}: ${formatResultNumber(Math.abs(output.value))}%`,
    })
  }

  function reset() {
    setFirst("")
    setSecond("")
    setError("")
    setResult(null)
  }

  const currentLabels = labels()

  return (
    <ToolLayout
      tool={tool}
      faq={faq}
      instructions={
        <ol>
          <li>Choose the type of percentage you need.</li>
          <li>Fill in both numbers. You can use decimals.</li>
          <li>Select Calculate to see the result, or Reset to start again.</li>
        </ol>
      }
    >
      <form className="panel tool-form" onSubmit={onSubmit}>
        <div className="mode-tabs" role="group" aria-label="Calculation type">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={mode === item.id}
              onClick={() => {
                setMode(item.id)
                setResult(null)
                setError("")
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="field" htmlFor="first">
          {currentLabels.first}
          <input
            id="first"
            inputMode="decimal"
            value={first}
            onChange={(event) => setFirst(event.target.value)}
          />
        </label>
        <label className="field" htmlFor="second">
          {currentLabels.second}
          <input
            id="second"
            inputMode="decimal"
            value={second}
            onChange={(event) => setSecond(event.target.value)}
          />
        </label>
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="actions">
          <button className="button" type="submit">
            Calculate
          </button>
          <button className="button-secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </form>
      {result ? (
        <section className="result-card" aria-live="polite">
          <h2>Result</h2>
          <p className="age-highlight" style={{ fontSize: "1.6rem" }}>
            {result.text}
          </p>
        </section>
      ) : null}
    </ToolLayout>
  )
}
