import Link from "next/link";

export default function PortfolioPage() {
  const createdAt = new Date();
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
      <main className="flex flex-col p-8 space-y-8">
        {/* Top Section: Large single image + description */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Large image */}
          <div className="lg:w-2/3 w-full">
            <img
              src="https://twistedsifter.com/wp-content/uploads/2017/09/sally-west-art-beach-snow-oil-painting-thick-1.jpg"
              alt="Artwork"
              className="w-full h-auto rounded-2xl object-cover shadow"
            />
          </div>

          {/* Description Section */}
          <div className="lg:w-1/3 w-full flex flex-col">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-4">Digital Art Collection</h1>

            {/* Profile + Name + Date */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://wallpapers.com/images/hd/gintama-elizabeth-cosplay-gintoki-sakata-wvcy4tfygu15rtqw.jpg"
                  alt="Artist"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="font-medium">Sadaharu</span>
              </div>
              <span className="text-gray-500 text-sm">{formattedDate}</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-2">
              This artwork is a detailed digital piece inspired by modern art techniques.
            </p>

            {/* Additional details */}
            <p className="text-gray-600">
              Here you can write more about the work, techniques, inspiration, or other details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
