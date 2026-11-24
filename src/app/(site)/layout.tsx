import type { Metadata } from 'next'
import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google'
import { Header, Footer } from '@/components/marge/Shell'
import { SiteAnalytics } from '@/components/marge/SiteAnalytics'
import './globals.css'
import { SITE_TITLE } from '@/content/campus-cycle'
const sans = Hanken_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})
export const metadata: Metadata = {
  title: SITE_TITLE,
  description:
    'Van een volle agenda naar een week die werkt. Ontdek studiemethodes, maak je planning en vind samen met je mentor een moment.',
  metadataBase: new URL('https://marge-team9.vercel.app'),
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="nl" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Ga naar de inhoud
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <SiteAnalytics />
      </body>
    </html>
  )
}
