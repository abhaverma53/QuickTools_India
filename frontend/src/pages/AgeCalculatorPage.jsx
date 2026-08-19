import { useState } from "react"
import ToolLayout from "../components/ToolLayout"
import { getTool } from "../data/tools"
import { calculateAge, formatLongDate, parseDob } from "../utils/age"

const tool = getTool("age-calculator")

const faq = [
  {
    question: "How should I enter my date of birth?",
    answer: "Use DD/MM/YYYY, for example 26/01/1996. You can also use dots or hyphens, such as 26-01-1996.",
  },
  {
    question: "Does this tool send my date of birth anywhere?",
    answer: "No. The calculation runs in your browser and is not stored on our servers.",
  },
  {
    question: "What if I was born on 29 February?",
    answer: "In non-leap years, the next birthday is shown as 28 February.",
  },
]

export default function AgeCalculatorPage() {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  function onSubmit(event) {
    event.preventDefault()
    const parsed = parseDob(input)
    if (parsed.error) {
      setError(parsed.error)
      setResult(null)
      return
    }
    setError("")
    setResult(calculateAge(parsed.date))
  }

  function reset() {
    setInput("")
    setError("")
    setResult(null)
  }

  return (
    <ToolLayout
      tool={tool}
      faq={faq}
      instructions={
        <ol>
          <li>Enter your date of birth as DD/MM/YYYY.</li>
          <li>Select Calculate Age.</li>
          <li>Read years, months and days, plus totals and your next birthday.</li>
        </ol>
      }
    >
      <form className="panel tool-form" onSubmit={onSubmit}>
        <label className="field" htmlFor="dob">
          Date of Birth
          <input
            id="dob"
            name="dob"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="DD/MM/YYYY"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "dob-error" : undefined}
          />
        </label>
        {error ? (
          <p className="error" id="dob-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="actions">
          <button className="button" type="submit">
            Calculate Age
          </button>
          <button className="button-secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      {result ? (
        <section className="result-card" aria-live="polite">
          <h2>Your Age</h2>
          <p className="age-highlight">
            {result.years} Years
          </p>
          <p>
            {result.months} Months
            <br />
            {result.days} Days
          </p>
          <div className="stats">
            <p>
              <strong>Total Months:</strong> {result.totalMonths}
            </p>
            <p>
              <strong>Total Weeks:</strong> {result.totalWeeks}
            </p>
            <p>
              <strong>Total Days:</strong> {result.totalDays}
            </p>
            <p>
              <strong>Next Birthday:</strong> {formatLongDate(result.nextBirthday)}
              {result.daysUntil === 0 ? " (today)" : ` (${result.daysUntil} day${result.daysUntil === 1 ? "" : "s"} away)`}
            </p>
          </div>
        </section>
      ) : null}
    </ToolLayout>
  )
}
