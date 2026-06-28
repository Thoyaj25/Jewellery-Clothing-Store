export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <div className="max-w-2xl text-center">
        <p className="text-6xl font-light mb-6">404</p>
        <h1 className="text-3xl font-light mb-4">Page not found</h1>
        <p className="text-gray-400 mb-8">
          The product or page you are looking for does not exist.
          Please check the URL or return to the homepage.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-amber-600 px-6 py-3 text-sm font-light text-white hover:bg-amber-600/20 transition"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
