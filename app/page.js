export default function SearchStudent() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Search Student Portfolios</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src="/flower.jpg"
              alt="Portfolio"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-sm font-medium">Digital Art Collection</div>
          </div>
        ))}
      </div>
    </div>
  );
}
