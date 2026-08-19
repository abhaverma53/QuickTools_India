import { useMemo, useState } from "react"
import ToolLayout from "../components/ToolLayout"
import { getTool } from "../data/tools"
import { downloadBlob } from "../utils/format"

const tool = getTool("qr-code-generator")

const faq = [
  {
    question: "Where is the QR code created?",
    answer: "It is generated in your browser. The text you enter is not uploaded to our Rails server.",
  },
  {
    question: "What can I put in a QR code?",
    answer: "A website, any text, a phone number, an email address, or Wi-Fi network details.",
  },
  {
    question: "Why will the QR not generate?",
    answer: "The content cannot be empty. For Wi-Fi, a network name is required. Very long text may also fail in some browsers.",
  },
]

function buildPayload(kind, fields) {
  const value = fields.text.trim()
  if (kind === "url" || kind === "text") {
    if (!value) return { error: "Please enter text or a URL." }
    return { value }
  }
  if (kind === "phone") {
    if (!value) return { error: "Please enter a phone number." }
    return { value: `tel:${value.replace(/\s+/g, "")}` }
  }
  if (kind === "email") {
    if (!value) return { error: "Please enter an email address." }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { error: "Please enter a valid email address." }
    return { value: `mailto:${value}` }
  }
  if (!fields.ssid.trim()) return { error: "Please enter the Wi-Fi network name (SSID)." }
  const encryption = fields.encryption
  const password = encryption === "nopass" ? "" : fields.password
  if (encryption !== "nopass" && !password) return { error: "Please enter the Wi-Fi password." }
  const escape = (text) => String(text).replace(/([\\;,:"])/g, "\\$1")
  return {
    value: `WIFI:T:${encryption};S:${escape(fields.ssid)};P:${escape(password)};;`,
  }
}

export default function QrGeneratorPage() {
  const [kind, setKind] = useState("text")
  const [text, setText] = useState("")
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [encryption, setEncryption] = useState("WPA")
  const [error, setError] = useState("")
  const [dataUrl, setDataUrl] = useState("")
  const [busy, setBusy] = useState(false)

  const label = useMemo(() => {
    if (kind === "url") return "Website URL"
    if (kind === "phone") return "Phone number"
    if (kind === "email") return "Email address"
    return "Text / URL"
  }, [kind])

  async function generate(event) {
    event.preventDefault()
    const payload = buildPayload(kind, { text, ssid, password, encryption })
    if (payload.error) {
      setError(payload.error)
      setDataUrl("")
      return
    }
    setBusy(true)
    setError("")
    try {
      const QRCode = (await import("qrcode")).default
      const url = await QRCode.toDataURL(payload.value, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: "M",
      })
      setDataUrl(url)
    } catch {
      setError("The QR code could not be created. Try shorter text.")
      setDataUrl("")
    } finally {
      setBusy(false)
    }
  }

  async function download() {
    if (!dataUrl) return
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    downloadBlob(blob, "quicktools-qr.png")
  }

  function reset() {
    setText("")
    setSsid("")
    setPassword("")
    setEncryption("WPA")
    setError("")
    setDataUrl("")
  }

  return (
    <ToolLayout
      tool={tool}
      faq={faq}
      instructions={
        <ol>
          <li>Choose what the QR code should open: text, a website, a phone number, email or Wi-Fi.</li>
          <li>Fill in the fields, then select Generate QR.</li>
          <li>Download the PNG if you want to save or print it.</li>
        </ol>
      }
    >
      <form className="panel tool-form" onSubmit={generate}>
        <label className="field" htmlFor="qr-type">
          QR type
          <select id="qr-type" value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="text">Text / URL</option>
            <option value="url">Website URL</option>
            <option value="phone">Phone number</option>
            <option value="email">Email</option>
            <option value="wifi">Wi-Fi</option>
          </select>
        </label>

        {kind === "wifi" ? (
          <>
            <label className="field" htmlFor="ssid">
              Network name (SSID)
              <input id="ssid" value={ssid} onChange={(event) => setSsid(event.target.value)} />
            </label>
            <label className="field" htmlFor="encryption">
              Security
              <select id="encryption" value={encryption} onChange={(event) => setEncryption(event.target.value)}>
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No password</option>
              </select>
            </label>
            {encryption !== "nopass" ? (
              <label className="field" htmlFor="wifi-pass">
                Password
                <input
                  id="wifi-pass"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
            ) : null}
          </>
        ) : (
          <label className="field" htmlFor="qr-text">
            {label}
            <input
              id="qr-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={kind === "url" ? "https://example.com" : ""}
            />
          </label>
        )}

        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="actions">
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Generating…" : "Generate QR"}
          </button>
          <button className="button-secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      {dataUrl ? (
        <section className="result-card qr-preview" aria-live="polite">
          <h2>QR preview</h2>
          <img src={dataUrl} alt="Generated QR code" width="240" height="240" />
          <div className="actions">
            <button className="button" type="button" onClick={download}>
              Download PNG
            </button>
          </div>
        </section>
      ) : null}
    </ToolLayout>
  )
}
