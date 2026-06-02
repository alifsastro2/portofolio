import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import LoadingScreen from "@/components/LoadingScreen"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

const SITE_URL = "https://alifzidane-portofolio.vercel.app"
const TITLE = "Alif Ardezir Zidane — Fullstack & Mobile Developer"
const DESCRIPTION =
  "Portfolio of Alif Ardezir Zidane, a Fullstack and Mobile Developer specializing in Next.js, Flutter, and AI-assisted development. Founder of Digital bNb."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Flutter", "Next.js", "TypeScript", "Mobile Developer", "Fullstack", "Indonesia", "Alif Ardezir Zidane", "Digital bNb"],
  authors: [{ name: "Alif Ardezir Zidane" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Alif Ardezir Zidane",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-[#0f0f0f] text-[#f0f0f0] antialiased overflow-x-hidden">
        <LoadingScreen />
        {children}
      </body>
    </html>
  )
}
