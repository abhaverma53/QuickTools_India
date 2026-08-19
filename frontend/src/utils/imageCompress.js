const MAX_BYTES = 20 * 1024 * 1024
const MAX_DIMENSION = 8192
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export function validateImageFile(file, { maxBytes = MAX_BYTES } = {}) {
  if (!file) return "Please choose an image file."
  const type = (file.type || "").toLowerCase()
  const name = (file.name || "").toLowerCase()
  const allowedExt = /\.(jpe?g|png|webp)$/i.test(name)
  if (!ALLOWED_TYPES.includes(type) && !allowedExt) {
    return "Please upload a JPG, JPEG, PNG or WebP image."
  }
  if (file.size > maxBytes) {
    return `That file is too large. The limit is ${Math.round(maxBytes / (1024 * 1024))} MB.`
  }
  return null
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("This image could not be read. Try another file."))
    }
    image.src = url
  })
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Your browser could not compress this image. Try a smaller file."))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality,
    )
  })
}

function drawScaled(image, width, height) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const context = canvas.getContext("2d", { alpha: true })
  if (!context) throw new Error("Canvas is not available in this browser.")
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

function outputTypeFor(file, preferred) {
  if (preferred) return preferred
  const type = (file.type || "").toLowerCase()
  if (type === "image/webp") return "image/webp"
  return "image/jpeg"
}

function extensionFor(mimeType) {
  if (mimeType === "image/webp") return "webp"
  if (mimeType === "image/png") return "png"
  return "jpg"
}

export async function compressImage(file, { quality = 0.7, targetBytes = null, mimeType } = {}) {
  const image = await loadImage(file)
  let width = image.naturalWidth || image.width
  let height = image.naturalHeight || image.height

  if (!width || !height) {
    throw new Error("This image has no readable size. Try another file.")
  }

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const type = outputTypeFor(file, mimeType)
  let canvas = drawScaled(image, width, height)

  if (!targetBytes) {
    const blob = await canvasToBlob(canvas, type, clampQuality(quality))
    return { blob, width: canvas.width, height: canvas.height, mimeType: type, extension: extensionFor(type) }
  }

  let best = null
  for (let round = 0; round < 8; round += 1) {
    let low = 0.12
    let high = 0.92
    for (let step = 0; step < 8; step += 1) {
      const q = (low + high) / 2
      const blob = await canvasToBlob(canvas, type, q)
      if (blob.size <= targetBytes) {
        best = blob
        low = q
      } else {
        high = q
      }
    }

    if (best) {
      return { blob: best, width: canvas.width, height: canvas.height, mimeType: type, extension: extensionFor(type) }
    }

    width = Math.max(32, Math.round(width * 0.72))
    height = Math.max(32, Math.round(height * 0.72))
    canvas = drawScaled(image, width, height)
  }

  const fallback = await canvasToBlob(canvas, type, 0.12)
  return { blob: fallback, width: canvas.width, height: canvas.height, mimeType: type, extension: extensionFor(type) }
}

function clampQuality(quality) {
  return Math.min(0.95, Math.max(0.1, Number(quality) || 0.7))
}

export function fileNameForCompressed(originalName, extension) {
  const base = String(originalName || "image").replace(/\.[^.]+$/, "")
  return `${base}-compressed.${extension}`
}
