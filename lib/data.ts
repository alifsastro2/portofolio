export type Project = {
  title: string
  description: string
  tags: string[]
  github: string | null
  live: string | null
  type: string
  image: string | null
}

export const projects: Project[] = [
  {
    title: "POS Cashier",
    description:
      "Web-based point-of-sale system with Midtrans payment integration, inventory management, and real-time sales reporting for small businesses.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Midtrans"],
    github: "https://github.com/alifsastro2/pos-cashier",
    live: "http://pos.digitalbnb.my.id/",
    type: "Web App",
    image: null,
  },
  {
    title: "Digital bNb Invitation",
    description:
      "SaaS digital wedding invitation platform with multi-client admin panel, Xendit payment gateway, GSAP animations, and production deployment.",
    tags: ["Next.js", "TypeScript", "Supabase", "Xendit", "GSAP"],
    github: null,
    live: "https://invite.digitalbnb.my.id",
    type: "SaaS",
    image: null,
  },
  {
    title: "Water Therapy Management App",
    description:
      "Multi-role Android app for water therapy management with automated revenue sharing, session attendance, multi-method payments, and dynamic PDF reports.",
    tags: ["Flutter", "Dart", "Supabase"],
    github: "https://github.com/alifsastro2/tsas",
    live: null,
    type: "Mobile App",
    image: null,
  },
  {
    title: "Home Catering App",
    description:
      "Home catering Android app with real-time order tracking, AI-powered assistant via Claude, Google Maps delivery fee calculation, and Firebase FCM notifications.",
    tags: ["Flutter", "Dart", "Firebase", "Google Maps SDK", "Claude AI"],
    github: "https://github.com/alifsastro2/warung-gemoy",
    live: null,
    type: "Mobile App",
    image: null,
  },
  {
    title: "Company Profile Website",
    description:
      "Dynamic company profile website for a cleaning & maintenance company operating in Indonesia and Malaysia, with custom PHP CMS and Google Analytics integration.",
    tags: ["PHP", "Bootstrap", "Google Analytics API"],
    github: "https://github.com/alifsastro2/cacsfm-website",
    live: "https://cacsfm.id",
    type: "Web App",
    image: null,
  },
]

export type SkillCategory = {
  name: string
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  { name: "Mobile", items: ["Flutter", "Dart", "Android Deployment"] },
  {
    name: "Web & Backend",
    items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "Anime.js", "HTML5 Canvas", "Web Audio API", "next/og", "PHP", "Laravel", "REST API"],
  },
  {
    name: "Database",
    items: ["PostgreSQL", "MySQL", "Supabase", "Firebase", "Prisma"],
  },
  { name: "Payment", items: ["Xendit", "Midtrans"] },
  {
    name: "AI & Automation",
    items: ["Claude Code", "OpenAI API", "Groq", "n8n", "Prompt Engineering"],
  },
  {
    name: "API Integration",
    items: ["Google Maps SDK", "Distance Matrix API", "Google Analytics API"],
  },
  {
    name: "Tools",
    items: ["Git", "GitHub", "Vercel", "FFmpeg", "Postman", "Jira", "TestRail", "VS Code", "Android Studio"],
  },
  {
    name: "Creative & Productivity",
    items: ["Canva", "Suno AI", "Seedance", "Microsoft Office", "OBS Studio", "Roblox Studio", "Trello", "Google Workspace", "Looker Studio", "ElevenLabs"],
  },
]

// Static fallback for Certificates (used when Supabase has no rows / is unreachable).
// Shape mirrors the `certificates` table Row type.
export type CertificateFallback = {
  id: string
  title: string
  issuer: string | null
  year: string | null
  image_url: string
  pdf_url: string | null
  display_order: number
  created_at: string
}

const certSlugs: { slug: string; title: string; issuer: string; year: string }[] = [
  { slug: 'business-intelligence', title: 'Creating Business Intelligence',           issuer: 'Universitas Gunadarma', year: 'Jun 2025' },
  { slug: 'data-analytics',        title: 'Data Analytics',                            issuer: 'RevoU',                 year: 'Mar 2025' },
  { slug: 'oracle-intermediate',   title: 'Oracle for Intermediate',                   issuer: 'Universitas Gunadarma', year: 'Aug 2024' },
  { slug: 'data-prep',             title: 'Data Preparation for Business Processes',   issuer: 'Universitas Gunadarma', year: 'Sep 2024' },
  { slug: 'html5',                 title: 'Building Website using HTML5',              issuer: 'Universitas Gunadarma', year: 'May 2023' },
  { slug: 'java',                  title: 'Java Programming (J2SE)',                   issuer: 'Universitas Gunadarma', year: 'Feb 2023' },
  { slug: 'oracle-beginner',       title: 'Oracle for Beginner',                       issuer: 'Universitas Gunadarma', year: 'Feb 2023' },
  { slug: 'dbms',                  title: 'Fundamental DBMS',                          issuer: 'Universitas Gunadarma', year: 'Aug 2022' },
  { slug: 'erp',                   title: 'Fundamental ERP',                           issuer: 'Universitas Gunadarma', year: 'Feb 2022' },
]

export const certificates: CertificateFallback[] = certSlugs.map((c, i) => ({
  id: c.slug,
  title: c.title,
  issuer: c.issuer,
  year: c.year,
  image_url: `/certificates/${c.slug}.png`,
  pdf_url: `/certificates/${c.slug}.pdf`,
  display_order: i,
  created_at: new Date().toISOString(),
}))
