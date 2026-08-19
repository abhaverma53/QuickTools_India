import { useEffect, useRef, useState } from "react"
import ToolLayout from "../components/ToolLayout"
import { getTool } from "../data/tools"
import { downloadBlob, formatBytes, percentReduced } from "../utils/format"
import {
  compressImage,
  fileNameForCompressed,
  validateImageFile,
} from "../utils/imageCompress"

const tool = getTool("image-compressor")
const TARGETS = [
  { label: "No target", value: "" },
  { label: "100 KB", value: String(100 * 1024) },
  { label: "200 KB", value: String(200 * 1024) },
  { label: "500 KB", value: String(500 * 1024) },
  { label: "1 MB", value: String(1024 * 1024) },
]

const faq = [
  {
    question: "Are my images uploaded to a server?",
    answer:
      "This tool compresses images in your browser. Files are not sent to the QuickTools India Rails server for compression.",
  },
  {
    question: "Which formats are supported?",
    answer: "JPG, JPEG, PNG and WebP. PNG files are converted to JPEG or WebP so they can actually get smaller.",
  },
  {
    question: "Why is the file still larger than my target?",
    answer:
      "Some photos cannot shrink below a certain size without becoming unreadable. The tool lowers quality and, if needed, dimensions, then gives you the smallest result it can.",
  },
]

export default function ImageCompressorPage() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [quality, setQuality] = useState(0.7)
  const [target, setTarget] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function assignFile(nextFile) {
    const problem = validateImageFile(nextFile)
    if (problem) {
      setError(problem)
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setError("")
    setResult(null)
    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
  }

  function onDrop(event) {
    event.preventDefault()
    setDragging(false)
    const next = event.dataTransfer.files?.[0]
    if (next) assignFile(next)
  }

  async function compress(event) {
    event.preventDefault()
    if (!file) {
      setError("Please upload an image first.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const output = await compressImage(file, {
        quality,
        targetBytes: target ? Number(target) : null,
      })
      const url = URL.createObjectURL(output.blob)
      setResult((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url)
        return {
          ...output,
          url,
          reduction: percentReduced(file.size, output.blob.size),
        }
      })
    } catch (err) {
      setError(err.message || "Compression failed. Try a smaller image.")
      setResult(null)
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview)
    if (result?.url) URL.revokeObjectURL(result.url)
    setFile(null)
    setPreview("")
    setQuality(0.7)
    setTarget("")
    setError("")
    setResult(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <ToolLayout
      tool={tool}
      faq={faq}
      instructions={
        <ol>
          <li>Drop a JPG, PNG or WebP file, or choose one from your device.</li>
          <li>Pick a quality level, or a target size such as 200 KB.</li>
          <li>Compress the image, check the new size, then download it.</li>
        </ol>
      }
    >
      <form className="panel tool-form" onSubmit={compress}>
        <div
          className={`dropzone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click()
          }}
          role="button"
          tabIndex={0}
        >
          <p>Drop an image here, or click to choose a file.</p>
          <p className="status-line">JPG, PNG or WebP up to 20 MB.</p>
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(event) => {
              const next = event.target.files?.[0]
              if (next) assignFile(next)
            }}
          />
        </div>

        {file ? (
          <div className="preview-row">
            {preview ? <img src={preview} alt="Original upload preview" /> : null}
            <div>
              <p>
                <strong>{file.name}</strong>
              </p>
              <p>Original size: {formatBytes(file.size)}</p>
            </div>
          </div>
        ) : null}

        <label className="field" htmlFor="quality">
          Compression quality: {Math.round(quality * 100)}%
          <input
            id="quality"
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
            disabled={Boolean(target)}
          />
        </label>
        <label className="field" htmlFor="target">
          Target size
          <select id="target" value={target} onChange={(event) => setTarget(event.target.value)}>
            {TARGETS.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {target ? (
          <p className="status-line">Quality is adjusted automatically to try to meet the target size.</p>
        ) : null}

        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="actions">
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Compressing…" : "Compress image"}
          </button>
          <button className="button-secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      {result ? (
        <section className="result-card" aria-live="polite">
          <h2>Compressed image</h2>
          <div className="preview-row">
            <img src={result.url} alt="Compressed image preview" />
            <div className="stats">
              <p>Original size: {formatBytes(file.size)}</p>
              <p>Compressed size: {formatBytes(result.blob.size)}</p>
              <p>Reduced by: {result.reduction}%</p>
            </div>
          </div>
          <div className="actions">
            <button
              className="button"
              type="button"
              onClick={() => downloadBlob(result.blob, fileNameForCompressed(file.name, result.extension))}
            >
              Download
            </button>
          </div>
        </section>
      ) : null}
    </ToolLayout>
  )
}
