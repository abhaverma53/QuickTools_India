import { useEffect, useRef, useState } from "react"
import ToolLayout from "../components/ToolLayout"
import { getTool } from "../data/tools"
import { downloadBlob } from "../utils/format"
import { validateImageFile } from "../utils/imageCompress"

const tool = getTool("jpg-to-pdf")
const MAX_FILES = 20

const faq = [
  {
    question: "Are my photos uploaded?",
    answer:
      "This converter builds the PDF in your browser. Images are not uploaded to the QuickTools India Rails server for conversion.",
  },
  {
    question: "Which image types can I add?",
    answer: "JPG, JPEG, PNG and WebP. You can add several images and reorder them before creating the PDF.",
  },
  {
    question: "Why did PDF creation fail?",
    answer:
      "Very large images, too many pages, or a browser memory limit can stop PDF creation. Try fewer or smaller photos.",
  },
]

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("One of the images could not be read."))
    reader.readAsDataURL(file)
  })
}

export default function JpgToPdfPage() {
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [])

  function addFiles(fileList) {
    const incoming = Array.from(fileList || [])
    if (!incoming.length) return
    const next = [...items]
    for (const file of incoming) {
      const problem = validateImageFile(file, { maxBytes: 10 * 1024 * 1024 })
      if (problem) {
        setError(problem)
        continue
      }
      if (next.length >= MAX_FILES) {
        setError(`You can add up to ${MAX_FILES} images.`)
        break
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      })
    }
    setItems(next)
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const copy = [...items]
    const [removed] = copy.splice(index, 1)
    copy.splice(target, 0, removed)
    setItems(copy)
  }

  function remove(id) {
    setItems((current) => {
      const found = current.find((item) => item.id === id)
      if (found) URL.revokeObjectURL(found.preview)
      return current.filter((item) => item.id !== id)
    })
  }

  async function createPdf(event) {
    event.preventDefault()
    if (!items.length) {
      setError("Please add at least one image.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 8

      for (let index = 0; index < items.length; index += 1) {
        if (index > 0) pdf.addPage()
        const dataUrl = await readAsDataURL(items[index].file)
        const properties = pdf.getImageProperties(dataUrl)
        const maxW = pageW - margin * 2
        const maxH = pageH - margin * 2
        let width = maxW
        let height = (properties.height * width) / properties.width
        if (height > maxH) {
          height = maxH
          width = (properties.width * height) / properties.height
        }
        const x = (pageW - width) / 2
        const y = (pageH - height) / 2
        const format = /png/i.test(properties.fileType) ? "PNG" : "JPEG"
        pdf.addImage(dataUrl, format, x, y, width, height)
      }

      const blob = pdf.output("blob")
      downloadBlob(blob, "images.pdf")
    } catch {
      setError("The PDF could not be created. Try fewer or smaller images.")
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    items.forEach((item) => URL.revokeObjectURL(item.preview))
    setItems([])
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <ToolLayout
      tool={tool}
      faq={faq}
      instructions={
        <ol>
          <li>Add one or more JPG, PNG or WebP images.</li>
          <li>Reorder or remove images until the sequence looks right.</li>
          <li>Create the PDF and download it to your device.</li>
        </ol>
      }
    >
      <form className="panel tool-form" onSubmit={createPdf}>
        <div
          className={`dropzone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            addFiles(event.dataTransfer.files)
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click()
          }}
          role="button"
          tabIndex={0}
        >
          <p>Drop images here, or click to choose files.</p>
          <p className="status-line">Up to {MAX_FILES} images, 10 MB each.</p>
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(event) => addFiles(event.target.files)}
          />
        </div>

        {items.length ? (
          <ul className="image-list">
            {items.map((item, index) => (
              <li className="image-item" key={item.id}>
                <img src={item.preview} alt={`Page ${index + 1}: ${item.file.name}`} />
                <div>
                  <strong>{item.file.name}</strong>
                  <p className="status-line">Page {index + 1}</p>
                </div>
                <div className="item-actions">
                  <button type="button" className="button-secondary" onClick={() => move(index, -1)} disabled={index === 0}>
                    Move up
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                  >
                    Move down
                  </button>
                  <button type="button" className="button-secondary" onClick={() => remove(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="actions">
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Creating PDF…" : "Create PDF"}
          </button>
          <button className="button-secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </form>
    </ToolLayout>
  )
}
