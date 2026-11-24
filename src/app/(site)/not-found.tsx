import Link from 'next/link'
import { SITE_NAME } from '@/content/campus-cycle'
export default function NotFound() {
  return (
    <div className="wrap section">
      <title>{`Pagina niet gevonden · ${SITE_NAME}`}</title>
      <p className="eyebrow">Deze pagina is er niet</p>
      <h1>Even de weg kwijt?</h1>
      <p className="lead">
        Misschien is de link veranderd. Je kan altijd opnieuw beginnen bij je week of de
        studiemethodes.
      </p>
      <div className="actions">
        <Link className="button" href="/">
          Naar het begin
        </Link>
        <Link href="/methodes" className="text-link">
          Zoek een methode
        </Link>
      </div>
    </div>
  )
}
