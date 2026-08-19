// When you add a tool, also add a route in App.jsx and a URL in public/sitemap.xml.
export const SITE_NAME = "QuickTools India"
export const TAGLINE = "Simple tools for everyday life."
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://quicktoolsindia.com").replace(/\/$/, "")
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

export const tools = [
  {
    slug: "image-compressor",
    path: "/image-compressor",
    name: "Image Compressor",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    popular: true,
    keywords: ["compress", "image", "jpg", "jpeg", "png", "webp", "reduce size", "kb"],
    title: "Image Compressor Online - Reduce Image Size | QuickTools India",
    description:
      "Compress JPG, PNG and WebP images in your browser. Choose quality or a target size such as 100 KB, 200 KB, 500 KB or 1 MB, then download the smaller file.",
    summary: "Reduce JPG, PNG and WebP file size on your device.",
  },
  {
    slug: "jpg-to-pdf",
    path: "/jpg-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    categoryLabel: "PDF Tools",
    categoryPath: "/pdf-tools",
    popular: true,
    keywords: ["jpg", "jpeg", "png", "webp", "pdf", "convert", "images to pdf"],
    title: "JPG to PDF Converter - Convert Images to PDF | QuickTools India",
    description:
      "Convert JPG, PNG and WebP images to a PDF in your browser. Upload several photos, reorder them, then download a single PDF file.",
    summary: "Turn one or more images into a downloadable PDF.",
  },
  {
    slug: "qr-code-generator",
    path: "/qr-code-generator",
    name: "QR Code Generator",
    category: "generator",
    categoryLabel: "Generators",
    categoryPath: "/generators",
    popular: true,
    keywords: ["qr", "qr code", "wifi", "url", "phone", "email"],
    title: "QR Code Generator - Create QR Codes Free | QuickTools India",
    description:
      "Generate a QR code for a website, text, phone number, email or Wi-Fi network. Preview it instantly and download a PNG image.",
    summary: "Create a QR code for a link, text, phone, email or Wi-Fi.",
  },
  {
    slug: "age-calculator",
    path: "/age-calculator",
    name: "Age Calculator",
    category: "calculator",
    categoryLabel: "Calculators",
    categoryPath: "/calculators",
    popular: true,
    keywords: ["age", "dob", "birthday", "years", "date of birth"],
    title: "Age Calculator - Calculate Your Exact Age | QuickTools India",
    description:
      "Calculate your exact age in years, months and days from your date of birth. Also see total months, weeks, days and your next birthday.",
    summary: "Find exact age in years, months and days.",
  },
  {
    slug: "percentage-calculator",
    path: "/percentage-calculator",
    name: "Percentage Calculator",
    category: "calculator",
    categoryLabel: "Calculators",
    categoryPath: "/calculators",
    popular: true,
    keywords: ["percentage", "percent", "increase", "discount", "marks"],
    title: "Percentage Calculator - Find Percentages Easily | QuickTools India",
    description:
      "Work out what X% of Y is, what percentage one number is of another, and percentage increase or decrease. Clear inputs for everyday sums.",
    summary: "Work out percentages, marks and increase or decrease.",
  },
]

export const categories = [
  {
    slug: "calculator",
    path: "/calculators",
    name: "Calculators",
    description: "Everyday number tools for age, marks, discounts and percentage change.",
  },
  {
    slug: "image",
    path: "/image-tools",
    name: "Image Tools",
    description: "Compress photos in the browser before you share or upload them.",
  },
  {
    slug: "pdf",
    path: "/pdf-tools",
    name: "PDF Tools",
    description: "Turn images into a PDF without sending files to a server.",
  },
  {
    slug: "generator",
    path: "/generators",
    name: "Generators",
    description: "Create useful codes and files you can save on your phone or computer.",
  },
]

export const navItems = [
  { label: "Home", path: "/" },
  { label: "Calculators", path: "/calculators" },
  { label: "Image Tools", path: "/image-tools" },
  { label: "PDF Tools", path: "/pdf-tools" },
  { label: "Generators", path: "/generators" },
]

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug)
}

export function getToolsByCategory(category) {
  return tools.filter((tool) => tool.category === category)
}

export function getRelatedTools(slug, limit = 3) {
  const current = getTool(slug)
  if (!current) return tools.slice(0, limit)
  const sameCategory = tools.filter((tool) => tool.slug !== slug && tool.category === current.category)
  const others = tools.filter((tool) => tool.slug !== slug && tool.category !== current.category)
  return [...sameCategory, ...others].slice(0, limit)
}

export function searchTools(query) {
  const term = query.trim().toLowerCase()
  if (!term) return []
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.summary, tool.categoryLabel, ...tool.keywords].join(" ").toLowerCase()
    return haystack.includes(term)
  })
}

export const publicPaths = [
  "/",
  "/calculators",
  "/image-tools",
  "/pdf-tools",
  "/generators",
  "/image-compressor",
  "/jpg-to-pdf",
  "/qr-code-generator",
  "/age-calculator",
  "/percentage-calculator",
  "/about",
  "/privacy-policy",
  "/terms",
  "/contact",
]
