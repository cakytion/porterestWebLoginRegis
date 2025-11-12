import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfdfd]">
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
      className="border rounded-lg px-3 py-2 w-64 mx4"
    />

    <img
      src="https://wallpapers.com/images/hd/gintama-elizabeth-cosplay-gintoki-sakata-wvcy4tfygu15rtqw.jpg"
      alt="User Profile"
      className="w-10 h-10 object-cover rounded-full cursor-pointer ml-auto"
    />
  </div>
</header>


<main className="p-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-semibold">
      <span className="text-black-500">Search Results</span>
    </h2>

    <select className="border rounded-lg px-3 py-2">
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>


  </div>
     

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Link href={`/portfolio/${i + 1}`} key={i}>
              <div className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                <img
                  src="https://twistedsifter.com/wp-content/uploads/2017/09/sally-west-art-beach-snow-oil-painting-thick-1.jpg"
                  alt="Portfolio"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 text-sm font-medium">Digital Art Collection</div>
              </div>
            </Link>
          ))}
        </div>
      </main>

<div className="flex justify-end mt-6 mb-10">
  <div className="flex items-end text-gray-600 text-sm space-x-1">
    <button className="px-2 py-1 hover:text-pink-500">1</button>
    <button className="px-2 py-1 hover:text-pink-500">2</button>
    <button className="px-2 py-1 hover:text-pink-500">3</button>
    <span className="px-1">...</span>
    <button className="px-2 py-1 hover:text-pink-500">20</button>
  </div>
</div>
      <footer className="text-center py-4 text-sm text-gray-500">
        © 2025 Porterest. All rights reserved.
      </footer>
    </div>
  );
}
