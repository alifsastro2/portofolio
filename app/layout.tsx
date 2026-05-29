import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alif Ardezir Zidane — Fullstack & Mobile Developer",
  description:
    "Portfolio of Alif Ardezir Zidane, a Fullstack and Mobile Developer specializing in Next.js, Flutter, and AI-assisted development.",
  keywords: ["Flutter", "Next.js", "TypeScript", "Mobile Developer", "Fullstack", "Indonesia"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-[#0f0f0f] text-[#f0f0f0] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
