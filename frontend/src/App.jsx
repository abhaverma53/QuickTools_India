import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"

const HomePage = lazy(() => import("./pages/HomePage"))
const CategoryPage = lazy(() => import("./pages/CategoryPage"))
const AgeCalculatorPage = lazy(() => import("./pages/AgeCalculatorPage"))
const PercentageCalculatorPage = lazy(() => import("./pages/PercentageCalculatorPage"))
const QrGeneratorPage = lazy(() => import("./pages/QrGeneratorPage"))
const ImageCompressorPage = lazy(() => import("./pages/ImageCompressorPage"))
const JpgToPdfPage = lazy(() => import("./pages/JpgToPdfPage"))
const AboutPage = lazy(() => import("./pages/AboutPage"))
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"))
const TermsPage = lazy(() => import("./pages/TermsPage"))
const ContactPage = lazy(() => import("./pages/ContactPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page-loading">Loading…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculators" element={<CategoryPage slug="calculator" />} />
            <Route path="/image-tools" element={<CategoryPage slug="image" />} />
            <Route path="/pdf-tools" element={<CategoryPage slug="pdf" />} />
            <Route path="/generators" element={<CategoryPage slug="generator" />} />
            <Route path="/image-compressor" element={<ImageCompressorPage />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
            <Route path="/qr-code-generator" element={<QrGeneratorPage />} />
            <Route path="/age-calculator" element={<AgeCalculatorPage />} />
            <Route path="/percentage-calculator" element={<PercentageCalculatorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
