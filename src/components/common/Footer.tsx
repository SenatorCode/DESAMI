// src/components/common/Footer.tsx
import logoBlue from '@/assets/desamiBlue.png'

const links = ['Study Mode', 'Quiz Mode', 'Clutch Mode', 'Privacy Policy', 'Terms of Service']

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <img src={logoBlue} alt="Desami" className="mx-auto h-6 w-auto md:mx-0" />
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Desami. Bridging rigorous learning
            and dopamine-driven engagement.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {links.map((link) => (
            <a key={link} href="#" className="transition hover:text-foreground">
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}