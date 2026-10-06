import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-ui-caption">Page Not Found</p>
      <Link href="/" className="mt-4 text-sm underline">
        Return Home
      </Link>
    </div>
  )
}
