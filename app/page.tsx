import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Certificates from '@/components/Certificates'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import {
  getProjects,
  getSkillCategories,
  getAboutContent,
  getContactLinks,
  getCertificates,
} from '@/lib/supabase/queries'

export default async function Home() {
  const [projects, skillCategories, about, contactLinks, certificates] = await Promise.all([
    getProjects(),
    getSkillCategories(),
    getAboutContent(),
    getContactLinks(),
    getCertificates(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About about={about} />
        <Skills skillCategories={skillCategories} />
        <Projects projects={projects} />
        <Certificates certs={certificates} />
        <Contact links={contactLinks} />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
