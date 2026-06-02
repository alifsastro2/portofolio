import type { IconType } from 'react-icons'
import {
  SiFlutter, SiDart,
  SiNextdotjs, SiTypescript, SiJavascript, SiPhp, SiLaravel,
  SiPostgresql, SiMysql, SiSupabase, SiFirebase, SiPrisma,
  SiGit, SiGithub, SiPostman, SiJira, SiAndroidstudio,
  SiGooglemaps, SiGoogleanalytics,
  SiOpenai, SiN8N, SiXendit,
  SiWhatsapp, SiGmail,
  SiCanva, SiSuno, SiObsstudio, SiRobloxstudio,
  SiTrello, SiGoogle, SiLooker, SiElevenlabs,
  SiTailwindcss, SiReact, SiVercel, SiHtml5, SiFfmpeg,
} from 'react-icons/si'
import {
  FaEnvelope, FaMobileAlt, FaCode, FaDatabase,
  FaCreditCard, FaBrain, FaPlug, FaTools, FaLinkedin,
  FaPalette, FaMicrosoft, FaVideo, FaBolt, FaWaveSquare,
} from 'react-icons/fa'
import { FaWandMagicSparkles } from 'react-icons/fa6'
import { VscVscode, VscTerminal } from 'react-icons/vsc'

// Tech skill → icon
export const skillIconMap: Record<string, IconType> = {
  // Mobile
  'Flutter':            SiFlutter,
  'Dart':               SiDart,
  'Android Deployment': FaMobileAlt,
  // Web & Backend
  'Next.js':      SiNextdotjs,
  'React':        SiReact,
  'TypeScript':   SiTypescript,
  'JavaScript':   SiJavascript,
  'Tailwind CSS': SiTailwindcss,
  'Anime.js':     FaWandMagicSparkles,
  'HTML5 Canvas': SiHtml5,
  'Web Audio API': FaWaveSquare,
  'next/og':      SiNextdotjs,
  'PHP':          SiPhp,
  'Laravel':      SiLaravel,
  'REST API':     FaPlug,
  // Database
  'PostgreSQL': SiPostgresql,
  'MySQL':      SiMysql,
  'Supabase':   SiSupabase,
  'Firebase':   SiFirebase,
  'Prisma':     SiPrisma,
  // Payment
  'Xendit':   SiXendit,
  'Midtrans': FaCreditCard,
  // AI & Automation
  'Claude Code':        VscTerminal,
  'OpenAI API':         SiOpenai,
  'Groq':               FaBolt,
  'n8n':                SiN8N,
  'Prompt Engineering': FaBrain,
  // API Integration
  'Google Maps SDK':      SiGooglemaps,
  'Distance Matrix API':  SiGooglemaps,
  'Google Analytics API': SiGoogleanalytics,
  // Tools
  'Git':            SiGit,
  'GitHub':         SiGithub,
  'Postman':        SiPostman,
  'Jira':           SiJira,
  'TestRail':       FaCode,
  'VS Code':        VscVscode,
  'Android Studio': SiAndroidstudio,
  'Vercel':         SiVercel,
  'FFmpeg':         SiFfmpeg,
  // Creative & Productivity (non-coding)
  'Canva':            SiCanva,
  'Suno AI':          SiSuno,
  'Seedance':         FaVideo,
  'Microsoft Office': FaMicrosoft,
  'OBS Studio':       SiObsstudio,
  'Roblox Studio':    SiRobloxstudio,
  'Trello':           SiTrello,
  'Google Workspace': SiGoogle,
  'Looker Studio':    SiLooker,
  'ElevenLabs':       SiElevenlabs,
}

// Skill → logo image (untuk brand yang butuh logo gambar, bukan icon monochrome)
export const skillLogoMap: Record<string, string> = {}

// Contact label → icon
export const contactIconMap: Record<string, IconType> = {
  'Email':    FaEnvelope,
  'LinkedIn': FaLinkedin,
  'GitHub':   SiGithub,
  'WhatsApp': SiWhatsapp,
  'Gmail':    SiGmail,
}

// Category → fallback icon
export const categoryIconMap: Record<string, IconType> = {
  'Mobile':          FaMobileAlt,
  'Web & Backend':   FaCode,
  'Database':        FaDatabase,
  'Payment':         FaCreditCard,
  'AI & Automation': FaBrain,
  'API Integration': FaPlug,
  'Tools':           FaTools,
  'Creative & Productivity': FaPalette,
}
