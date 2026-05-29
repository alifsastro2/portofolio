import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import {
  getProjects,
  getSkillCategories,
  getBlogPosts,
  getAboutContent,
  getContactLinks,
} from '@/lib/supabase/queries'

export default async function Home() {
  const [projects, skillCategories, posts, about, contactLinks] = await Promise.all([
    getProjects(),
    getSkillCategories(),
    getBlogPosts(),
    getAboutContent(),
    getContactLinks(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About about={about} />
        <Projects projects={projects} />
        <Skills skillCategories={skillCategories} />
        <Blog posts={posts} />
        <Contact links={contactLinks} />
      </main>
      <Footer />
    </>
  )
}
