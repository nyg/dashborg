import Head from 'next/head'
import ActiveLink from './active-link'
import FooterImageLink from './footer-image-link'

export default function Layout({ children, name }) {

  return (
    <div>
      <Head>
        <title>{`${name} • DashBorg`}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <script data-goatcounter="/api/count" async src="/count.js"></script> */}
        {/* <meta name="viewport" content="viewport-fit=cover" /> */}
      </Head>

      <main className="flex flex-col h-screen text-gray-600">

        <header className="bg-gray-100">
          <div className="lg:max-w-5xl pt-6 pb-6 pl-6">
            <h1 className="text-3xl text-gray-900 font-bold">DashBorg</h1>
            <p className="text-sm">The dashboard for your <a href="http://swissborg.com/">SwissBorg</a> account.</p>
          </div>
        </header>

        <nav className="bg-gray-300">
          <div className="lg:max-w-5xl pt-2 pb-2">
            <div className="m-auto flex flex-row w-3/5 text-center text-sm space-x-4">
              <ActiveLink href="/">Home</ActiveLink>
              <ActiveLink href="/funding">Funding</ActiveLink>
              <ActiveLink href="/yield">Smart Yield</ActiveLink>
              <ActiveLink href="/import">Import</ActiveLink>
            </div>
          </div>
        </nav>

        <div className="text-sm">
          <div className="lg:max-w-5xl pl-6 pt-8 pb-8">
            {children}
          </div>
        </div>

        <footer className="bg-gray-200 mt-auto">
          <div className="lg:max-w-5xl pt-2 pb-2 text-center leading-3">
            <FooterImageLink href="https://github.com/nyg/dashborg" src="/github.png" alt="github" />
          </div>
        </footer>
      </main>
    </div>
  )
}
