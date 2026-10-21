import { Link } from "react-router"

export default function ErrorPage() {
  return <main className="grid min-h-screen place-items-center px-4 text-center">
    <div>
      <h1 className="text-3xl font-semibold">Nothing here</h1>
      <p className="mt-2 text-white/70">This page does not exist, or something broke on the way.</p>
      <Link to="/" className="mt-6 inline-block text-gold">Back to clients</Link>
    </div>
  </main>
}
