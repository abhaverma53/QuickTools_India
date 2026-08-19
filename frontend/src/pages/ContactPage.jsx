import { useState } from "react"
import Seo from "../components/Seo"
import { fetchHealth } from "../api/client"
import { SITE_NAME } from "../data/tools"

export default function ContactPage() {
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  async function checkApi() {
    setError("")
    setStatus("Checking…")
    try {
      const data = await fetchHealth()
      setStatus(`${data.application} API status: ${data.status}`)
    } catch {
      setError("Could not reach the API. If you are running locally, make sure the Rails service is up.")
      setStatus("")
    }
  }

  return (
    <article className="page legal-page">
      <Seo
        title={`Contact | ${SITE_NAME}`}
        description="Contact QuickTools India about the calculators, image tools, PDF tools and generators."
        path="/contact"
      />
      <h1>Contact</h1>
      <p>
        Email <a href="mailto:abhaverma53@gmail.com">abhaverma53@gmail.com</a> for product questions. This
        first version does not include a server-side contact form.
      </p>
      <h2>Files and privacy</h2>
      <p>
        Current image, PDF and QR tools run in your browser. If something looks wrong on your device, include the
        browser name and the tool you were using.
      </p>
      <h2>Service status</h2>
      <p>
        You can check whether the Rails API is reachable. This only calls the public health endpoint and does not
        send your files.
      </p>
      <div className="actions">
        <button className="button" type="button" onClick={checkApi}>
          Check API health
        </button>
      </div>
      {status ? <p className="ok">{status}</p> : null}
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  )
}
