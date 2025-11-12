import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <img
              src="https://github.com/Cakytional/porterestWebLoginRegis/blob/main/frontend/src/assets/Logo.png?raw=true"
              alt="Logo"
              className="w-8 h-8 object-cover rounded-full"
            />
            <h1 className="text-xl font-bold text-black-600">Porterest</h1>
          </div>

          <input
            type="text"
            placeholder="Search Portfolios..."
            className="border rounded-lg px-3 py-2 w-64 mx-4"
          />

          <img
            src="https://wallpapers.com/images/hd/gintama-elizabeth-cosplay-gintoki-sakata-wvcy4tfygu15rtqw.jpg"
            alt="User Profile"
            className="w-10 h-10 object-cover rounded-full cursor-pointer ml-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 flex-1 space-y-8">
        {/* Discover Student Work */}
        <div className="flex flex-col items-center mb-8">
  <h2 className="text-3xl font-bold mb-4 text-center">
    <span className="text-black">Discover </span>
    <span className="text-purple-600">Student Work</span>
  </h2>
  <input
    type="text"
    placeholder="Search portfolios..."
    className="text-center rounded-lg px-3 py-2 w-64 border"
  />
</div>

        {/* Recently Viewed */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Link href={`/portfolio/${i + 1}`} key={i}>
                <div className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                  <img
                    src="https://twistedsifter.com/wp-content/uploads/2017/09/sally-west-art-beach-snow-oil-painting-thick-1.jpg"
                    alt="Portfolio"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 text-sm font-medium">
                    Digital Art Collection
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        © 2025 Porterest. All rights reserved.
      </footer>
    </div>
  );
}
