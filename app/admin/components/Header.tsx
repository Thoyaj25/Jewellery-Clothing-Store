export default function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Welcome to the Ultimate Collections admin panel
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-zinc-400">
          {today}
        </p>

        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-600/20 px-3 py-1 text-sm font-medium text-emerald-400">
          ● System Online
        </div>
      </div>
    </header>
  );
}
