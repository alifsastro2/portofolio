export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          tags: string[]
          type: string | null
          github: string | null
          live: string | null
          image: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          title: string
          description?: string | null
          tags?: string[]
          type?: string | null
          github?: string | null
          live?: string | null
          image?: string | null
          display_order?: number
        }
        Update: {
          title?: string
          description?: string | null
          tags?: string[]
          type?: string | null
          github?: string | null
          live?: string | null
          image?: string | null
          display_order?: number
        }
      }
      skill_categories: {
        Row: { id: string; name: string; display_order: number }
        Insert: { name: string; display_order?: number }
        Update: { name?: string; display_order?: number }
      }
      skills: {
        Row: { id: string; category_id: string; name: string; display_order: number }
        Insert: { category_id: string; name: string; display_order?: number }
        Update: { category_id?: string; name?: string; display_order?: number }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          tag: string | null
          published: boolean
          created_at: string
        }
        Insert: {
          title: string
          summary?: string | null
          content?: string | null
          tag?: string | null
          published?: boolean
        }
        Update: {
          title?: string
          summary?: string | null
          content?: string | null
          tag?: string | null
          published?: boolean
        }
      }
      about_content: {
        Row: {
          id: string
          bio_1: string | null
          bio_2: string | null
          location: string | null
          available: boolean
          updated_at: string
        }
        Insert: {
          bio_1?: string | null
          bio_2?: string | null
          location?: string | null
          available?: boolean
          updated_at?: string
        }
        Update: {
          bio_1?: string | null
          bio_2?: string | null
          location?: string | null
          available?: boolean
          updated_at?: string
        }
      }
      contact_links: {
        Row: {
          id: string
          label: string
          value: string | null
          href: string | null
          icon: string | null
          display_order: number
        }
        Insert: {
          label: string
          value?: string | null
          href?: string | null
          icon?: string | null
          display_order?: number
        }
        Update: {
          label?: string
          value?: string | null
          href?: string | null
          icon?: string | null
          display_order?: number
        }
      }
      certificates: {
        Row: {
          id: string
          title: string
          issuer: string | null
          year: string | null
          image_url: string
          pdf_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          title: string
          issuer?: string | null
          year?: string | null
          image_url: string
          pdf_url?: string | null
          display_order?: number
        }
        Update: {
          title?: string
          issuer?: string | null
          year?: string | null
          image_url?: string
          pdf_url?: string | null
          display_order?: number
        }
      }
    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type SkillCategory = Database['public']['Tables']['skill_categories']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type AboutContent = Database['public']['Tables']['about_content']['Row']
export type ContactLink = Database['public']['Tables']['contact_links']['Row']
export type Certificate = Database['public']['Tables']['certificates']['Row']
