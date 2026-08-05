import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Code2,
  Github,
  Globe2,
  Headphones,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Palette,
  Phone,
  Quote,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Group, Points } from 'three'
import * as THREE from 'three'

type Theme = 'dark' | 'light'

const ACCENTS: Record<Theme, string> = {
  dark: '#b7ff00',
  light: '#027bc2',
}

// Create a free form at https://formspree.io, then replace this with your own
// endpoint (e.g. https://formspree.io/f/xxxxabcd). Until you do, submissions
// automatically fall back to opening the visitor's email client instead.
const CONTACT_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

type ContactFormState = { name: string; email: string; projectType: string; message: string }
type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>
type SubmitStatus = 'idle' | 'sending' | 'success' | 'fallback' | 'error'

const initialContactForm: ContactFormState = {
  name: '',
  email: '',
  projectType: 'Web Development & Design',
  message: '',
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('aftermath-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('aftermath-theme', theme)
  }, [theme])

  return { theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) }
}

type FadeInProps = { children: ReactNode; delay?: number; className?: string }

function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.56, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function NeuralBust({ accent }: { accent: string }) {
  const bust = useRef<Group>(null)
  const particles = useRef<Points>(null)

  const headGeometry = useMemo(() => {
    // A real face-profile OUTLINE (nose bump, brow ridge, lips, chin, jaw,
    // back of skull) traced as a 2D shape, then extruded with a bevel. Unlike
    // a revolved lathe/sphere, this actually has a silhouette that reads as
    // a face — not a ball — from the front.
    const profile: [number, number][] = [
      [-0.35, -1.32], // neck base, back
      [-0.8, -0.85], // back of neck
      [-0.92, 0.05], // occiput (back of skull, widest point)
      [-0.78, 0.68], // upper back of head
      [-0.4, 1.02], // crown
      [0.05, 1.06], // top of forehead
      [0.32, 0.78], // forehead slope
      [0.4, 0.5], // brow ridge (slight bump)
      [0.32, 0.34], // eye socket (slight indent)
      [0.42, 0.2], // nose bridge
      [0.74, 0.02], // nose tip (bump forward)
      [0.5, -0.14], // nostril / philtrum
      [0.58, -0.24], // upper lip
      [0.56, -0.32], // mouth
      [0.44, -0.42], // lower lip / chin indent
      [0.56, -0.58], // chin tip
      [0.42, -0.76], // under chin
      [0.14, -0.94], // jaw angle
      [-0.12, -1.14], // neck front
      [-0.35, -1.32], // back to neck base (close)
    ]

    const points = profile.map(([x, y]) => new THREE.Vector2(x, y))
    const shape = new THREE.Shape()
    shape.moveTo(points[0].x, points[0].y)
    shape.splineThru(points.slice(1))

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 1.05,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
      curveSegments: 20,
    })
    geometry.center()
    return geometry
  }, [])

  const dust = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(560 * 3)

    for (let index = 0; index < 560; index += 1) {
      const seed = index * 12.9898
      const arc = seed * 0.18
      const radius = 1.3 + ((index * 17) % 100) / 100 * 1.9
      positions[index * 3] = 0.7 + Math.cos(arc) * radius
      positions[index * 3 + 1] = Math.sin(arc * 1.7) * (0.2 + ((index * 31) % 100) / 100 * 1.55)
      positions[index * 3 + 2] = Math.sin(arc) * 0.5 + ((index % 5) - 2) * 0.08
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  useFrame((state, delta) => {
    if (bust.current) {
      bust.current.rotation.y = THREE.MathUtils.lerp(
        bust.current.rotation.y,
        -0.92 + state.pointer.x * 0.16,
        delta * 1.8,
      )
      bust.current.rotation.x = THREE.MathUtils.lerp(
        bust.current.rotation.x,
        state.pointer.y * 0.09,
        delta * 1.8,
      )
    }
    if (particles.current) particles.current.rotation.z += delta * 0.025
  })

  return (
    <group ref={bust} rotation={[0, -0.92, 0]} position={[0.32, -0.15, 0]}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <mesh geometry={headGeometry}>
          <meshPhysicalMaterial color="#a3aeb8" metalness={0.42} roughness={0.5} clearcoat={0.25} />
        </mesh>
        <mesh geometry={headGeometry} scale={1.045}>
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.16} />
        </mesh>
        <mesh position={[0.32, 0.62, 0.4]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={accent} />
        </mesh>
        <mesh position={[0.05, 0.9, 0]} rotation={[0, 0, 0.05]} scale={[0.55, 0.045, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, -1.55, 0]} scale={[0.76, 0.68, 0.74]}>
          <coneGeometry args={[1, 1.55, 64]} />
          <meshPhysicalMaterial color="#596168" metalness={0.8} roughness={0.31} />
        </mesh>
        <points ref={particles} geometry={dust}>
          <pointsMaterial color={accent} size={0.028} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
        </points>
        <mesh position={[0.15, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.022, 10, 128]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.18, 1.25, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.7, 0.008, 8, 128, Math.PI * 1.52]} />
          <meshBasicMaterial color={accent} transparent opacity={0.38} />
        </mesh>
      </Float>
    </group>
  )
}

function HeroVisual({ accent }: { accent: string }) {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-glow" />
      <div className="visual-grid" />
      <Canvas camera={{ position: [0, 0, 5.35], fov: 42 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[-4, 4, 3]} intensity={3.2} color="#e6f2ff" />
        <pointLight position={[3, 1, 2]} intensity={12} color={accent} distance={7} />
        <pointLight position={[-2, -3, 2]} intensity={3} color="#75808a" distance={5} />
        <NeuralBust accent={accent} />
      </Canvas>
      <div className="visual-caption">NEURAL SYSTEM / 01</div>
    </div>
  )
}

const services = [
  { icon: Code2, title: 'Software Development', text: 'Custom software that solves real business problems.' },
  { icon: Globe2, title: 'Web Development & Design', text: 'Modern, responsive websites that convert and grow your brand.' },
  { icon: Smartphone, title: 'Mobile App Development', text: 'Purposeful mobile apps for Android and iOS platforms.' },
  { icon: BriefcaseBusiness, title: 'CVs & Portfolios', text: 'Professional CVs and standout portfolios that get you noticed.' },
  { icon: Palette, title: 'Branding & Design', text: 'Creative brands that leave a lasting impression.' },
  { icon: Rocket, title: 'Digital Solutions & AI', text: 'Smart systems and automation to save time and scale.' },
]

const work = [
  { tag: 'Web application', title: 'FinTrack Dashboard', visual: 'dashboard' },
  { tag: 'Mobile application', title: 'CampusKonnek App', visual: 'mobile' },
  { tag: 'Web development', title: 'BizNext Website', visual: 'website' },
  { tag: 'CV & portfolio', title: 'Professional CV Design', visual: 'cv' },
  { tag: 'Branding', title: 'Brand Identity Pack', visual: 'brand' },
]

const testimonials = [
  { name: 'Thabo M.', role: 'Business Owner', initials: 'TM', text: 'AfterMath built our system exactly the way we imagined. Professional, reliable, and easy to work with!' },
  { name: 'Lerato K.', role: 'Software Developer', initials: 'LK', text: 'My portfolio and CV look amazing! I started getting interview calls within days of using them.' },
  { name: 'Sipho D.', role: 'Operations Manager', initials: 'SD', text: 'They solved our problem and automated our process. Saved us time and money!' },
]

function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialContactForm)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const handleChange =
    (field: keyof ContactFormState) =>
    (event: { target: { value: string } }) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }

  const validate = () => {
    const nextErrors: ContactFormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) nextErrors.message = 'Add a few more details (10+ characters).'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setStatus('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.currentTarget),
      })
      if (!response.ok) throw new Error('Form service unavailable')
      setStatus('success')
      setForm(initialContactForm)
    } catch {
      const subject = encodeURIComponent(`New project enquiry — ${form.projectType}`)
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.projectType}\n\n${form.message}`,
      )
      window.location.href = `mailto:hello@aftermath.studio?subject=${subject}&body=${body}`
      setStatus('fallback')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className={`form-field${errors.name ? ' has-error' : ''}`}>
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" value={form.name} onChange={handleChange('name')} placeholder="Your name" />
          {errors.name && <span className="form-error-text">{errors.name}</span>}
        </div>
        <div className={`form-field${errors.email ? ' has-error' : ''}`}>
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" value={form.email} onChange={handleChange('email')} placeholder="you@email.com" />
          {errors.email && <span className="form-error-text">{errors.email}</span>}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="cf-type">Project type</label>
        <select id="cf-type" name="projectType" value={form.projectType} onChange={handleChange('projectType')}>
          <option>Web Development & Design</option>
          <option>Mobile App Development</option>
          <option>Software Development</option>
          <option>CVs & Portfolios</option>
          <option>Branding & Design</option>
          <option>Digital Solutions & AI</option>
          <option>Something else</option>
        </select>
      </div>
      <div className={`form-field${errors.message ? ' has-error' : ''}`}>
        <label htmlFor="cf-message">Project details</label>
        <textarea
          id="cf-message"
          name="message"
          value={form.message}
          onChange={handleChange('message')}
          placeholder="Tell us about your idea, timeline, and goals..."
        />
        {errors.message && <span className="form-error-text">{errors.message}</span>}
      </div>
      <button className="button button-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowRight size={17} />
      </button>
      {status === 'success' && (
        <p className="form-status success">Thanks — your message is in. We'll reply within 1–2 business days.</p>
      )}
      {status === 'fallback' && (
        <p className="form-status success">We've opened your email app with the message ready — hit send there to reach us.</p>
      )}
      {status === 'error' && (
        <p className="form-status error">Something went wrong. Please email us directly at hello@aftermath.studio.</p>
      )}
    </form>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const accent = ACCENTS[theme]
  const nav = ['Services', 'Work', 'Process', 'About']

  return (
    <main>
      <section className="hero" id="home">
        <div className="noise" />
        <header className="site-header shell">
          <a className="brand" href="#home" aria-label="AfterMath home">
            <span className="brand-mark"><i>A</i><b>M</b></span>
            <span>AFTER<span>MATH</span></span>
          </a>
          <nav className={menuOpen ? 'nav-open' : ''} aria-label="Primary navigation">
            <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <a className="header-cta" href="#contact">Start a project <ArrowUpRight size={15} /></a>
          <button
            className="theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="menu-toggle" type="button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="hero-inner shell">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="eyebrow">DIGITAL SOLUTIONS STUDIO <span /></p>
            <h1>Think.<br />Brainstorm.<br />Develop.<br /><em>Deploy.</em></h1>
            <p className="hero-text">We turn ideas into powerful digital solutions.<br />Solving problems. Building brands. Bringing goals to life.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">Start a project <ArrowRight size={17} /></a>
              <a className="button button-secondary" href="#services">Our services <ArrowRight size={17} /></a>
            </div>
          </motion.div>
          <HeroVisual accent={accent} />
        </div>
        <div className="stats shell">
          <div><BriefcaseBusiness /><strong>50<span>+</span></strong><small>Projects completed</small></div>
          <div><UsersRound /><strong>30<span>+</span></strong><small>Happy clients</small></div>
          <div><ShieldCheck /><strong>100<span>%</span></strong><small>Commitment</small></div>
          <div><Headphones /><strong>24/7</strong><small>Support</small></div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="shell">
          <FadeIn className="section-topline">
            <div><p className="kicker">WHAT WE DO</p><h2>Our Services</h2></div>
            <a className="text-link" href="#contact">View all services <ArrowRight size={15} /></a>
          </FadeIn>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, text }, index) => (
              <FadeIn key={title} delay={index * 0.05} className="service-card">
                <div className="icon-box"><Icon size={26} /></div>
                <h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Enquire about ${title}`}><ArrowUpRight size={18} /></a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="shell">
          <FadeIn className="center-heading"><p className="kicker">OUR PROCESS</p><h2>From Idea to Reality</h2><span /></FadeIn>
          <div className="process-line" />
          <div className="process-grid">
            {[
              [BrainCircuit, '01', 'Think', 'We listen, research and understand your ideas and challenges.'],
              [Sparkles, '02', 'Brainstorm', 'We analyse, discuss and create the best strategy for your solution.'],
              [Code2, '03', 'Develop', 'We design, build and develop with precision and creativity.'],
              [Rocket, '04', 'Deploy', 'We test, launch and support to ensure your success.'],
            ].map(([Icon, number, title, text], index) => {
              const ProcessIcon = Icon as typeof BrainCircuit
              return <FadeIn delay={index * 0.1} key={String(title)} className="process-step">
                <div className="process-icon"><ProcessIcon size={24} /></div>
                <div className="process-number">{String(number)}</div><h3>{String(title)}</h3><p>{String(text)}</p>
              </FadeIn>
            })}
          </div>
        </div>
      </section>

      <section className="section work-section" id="work">
        <div className="shell">
          <FadeIn className="section-topline"><div><p className="kicker">SELECTED WORK</p><h2>Featured Projects</h2></div><a className="text-link" href="#contact">View portfolio <ArrowRight size={15} /></a></FadeIn>
          <div className="work-grid">
            {work.map((project, index) => <FadeIn key={project.title} delay={index * 0.05} className="project-card">
              <div className={`project-art ${project.visual}`}><div className="project-screen"><span /><span /><span /></div></div>
              <div className="project-info"><div><h3>{project.title}</h3><p>{project.tag}</p></div><a href="#contact" aria-label={`See ${project.title}`}><ArrowUpRight size={16} /></a></div>
            </FadeIn>)}
          </div>
        </div>
      </section>

      <section className="section testimonials" id="about">
        <div className="shell">
          <FadeIn className="section-topline"><div><p className="kicker">WHAT CLIENTS SAY</p><h2>Testimonials</h2></div><div className="slider-arrows"><button aria-label="Previous testimonial"><ChevronLeft /></button><button aria-label="Next testimonial"><ChevronRight /></button></div></FadeIn>
          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => <FadeIn delay={index * 0.08} key={testimonial.name} className="testimonial-card">
              <Quote className="quote" size={28} /><p>“{testimonial.text}”</p><div className="person"><span>{testimonial.initials}</span><div><strong>{testimonial.name}</strong><small>{testimonial.role}</small></div></div>
            </FadeIn>)}
          </div>
        </div>
      </section>

      <section className="shell" id="contact">
        <FadeIn className="project-cta">
          <div className="cta-symbol"><Rocket size={35} /></div><h2>Ready to bring your<br />idea to <em>life?</em></h2><p>Let’s build something great together.<br />Tell us about your project and we’ll handle the rest.</p><a className="button button-primary" href="mailto:hello@aftermath.studio">Start your project <ArrowRight size={17} /></a>
        </FadeIn>
        <div className="contact-grid">
          <FadeIn className="contact-info">
            <p className="kicker">GET IN TOUCH</p>
            <h2>Tell us about your project</h2>
            <p>Share a few details below and we’ll get back to you with next steps — no sales call required first.</p>
            <div className="contact-detail"><Phone size={16} /> +27 60 422 0935</div>
            <div className="contact-detail"><Mail size={16} /> hello@aftermath.studio</div>
            <div className="contact-detail"><MapPin size={16} /> South Africa</div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand"><a className="brand" href="#home"><span className="brand-mark"><i>A</i><b>M</b></span><span>AFTER<span>MATH</span></span></a><p>We are a digital solutions company that helps individuals and businesses solve problems and achieve their goals through technology and creativity.</p></div>
          <div><h3>Quick links</h3><a href="#home">Home</a><a href="#services">Services</a><a href="#work">Portfolio</a><a href="#about">About us</a></div>
          <div><h3>Company</h3><a href="#about">About</a><a href="#process">Process</a><a href="#work">Projects</a><a href="#contact">Contact</a></div>
          <div><h3>Services</h3><a href="#services">Software development</a><a href="#services">Web development</a><a href="#services">Mobile apps</a><a href="#services">Branding & design</a></div>
          <div className="contact-list"><h3>Contact us</h3><a href="tel:+27604220935"><Phone /> +27 60 422 0935</a><a href="mailto:hello@aftermath.studio"><Mail /> hello@aftermath.studio</a><span><MapPin /> South Africa</span><div className="socials"><a aria-label="LinkedIn" href="#contact"><Linkedin /></a><a aria-label="GitHub" href="#contact"><Github /></a><a aria-label="Instagram" href="#contact"><Instagram /></a></div></div>
        </div>
        <div className="shell legal"><span>© 2026 AfterMath. All rights reserved.</span><span>Think. Brainstorm. Develop. Deploy.</span><a href="#home" aria-label="Back to top">↑</a></div>
      </footer>
    </main>
  )
}

export default App