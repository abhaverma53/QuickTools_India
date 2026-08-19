import { Link } from "react-router-dom"
import Seo from "../components/Seo"
import { SITE_NAME } from "../data/tools"

export default function PrivacyPage() {
  return (
    <article className="page legal-page">
      <Seo
        title={`Privacy Policy | ${SITE_NAME}`}
        description="How QuickTools India handles information. Image and PDF tools process files in your browser whenever possible."
        path="/privacy-policy"
      />
      <h1>Privacy Policy</h1>
      <p>Last updated: 19 August 2026</p>
      <h2>What this site does</h2>
      <p>
        QuickTools India provides calculators and file tools. You can use the current tools without creating an
        account.
      </p>
      <h2>Files you select</h2>
      <p>
        The Image Compressor, JPG to PDF converter and QR Code Generator are built to process data in your browser.
        Those tools do not upload your images or QR content to the QuickTools India Rails server as part of the
        current design.
      </p>
      <p>
        Your browser still needs local access to the files you choose so the page can display a preview and create a
        download. If a future tool needs a server, that page will say so clearly before you upload anything.
      </p>
      <h2>Technical data</h2>
      <p>
        The API may receive normal web-request information such as IP address, browser type and the page requested,
        for example when the site checks that the service is running. We do not use that to build marketing profiles
        in this version of the product.
      </p>
      <h2>Cookies and ads</h2>
      <p>
        This version does not run third-party advertisements. Layout space is reserved for ads later. If ads or
        analytics are added, this policy will be updated.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: see the <Link to="/contact">contact page</Link>.
      </p>
    </article>
  )
}
