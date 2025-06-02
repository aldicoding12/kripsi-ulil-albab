import React, { useState, useEffect } from "react";
import costumAPI from "../../api";

function DashboardView() {
  const [isVisible, setIsVisible] = useState(false);
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBerita = async () => {
    try {
      setLoading(true);
      const { data } = await costumAPI.get("/news?limit=3");
      setBerita(data.data || []);
      console.log(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Gagal memuat berita. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBerita();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <>
      {/* Hero Section dengan Parallax Effect */}
      <div className="relative w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-110 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dymmwbvx0/image/upload/v1747143410/bq7xdycb2dsx07jpmuai.jpg)",
          }}
        />

        {/* Gradient Overlay dengan Animasi */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent animate-pulse" />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content dengan Slide-in Animation */}
        <div className="absolute inset-0 flex items-start md:items-center pt-20 md:pb-40 justify-start px-6 md:px-12">
          <div
            className={`text-left space-y-6 z-10 transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}>
            {/* Greeting dengan Fade-in */}
            <h3
              className={`text-3xl md:text-4xl font-bold text-white transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}>
              <span className="inline-block animate-pulse">🕌</span> Ahwal wa
              Ahsalan
            </h3>

            {/* Main Title dengan Glow Effect */}
            <h1
              className={`text-4xl md:text-5xl font-bold text-green-400 drop-shadow-2xl transform transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } hover:text-green-300 hover:scale-105 transition-all duration-300`}>
              Masjid Ulil Albab
            </h1>

            {/* Subtitle dengan Typing Effect Simulation */}
            <h2
              className={`text-5xl md:text-7xl mt-3 font-bold text-white drop-shadow-xl transform transition-all duration-1000 delay-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } hover:text-gray-200 transition-colors duration-300`}>
              Universitas Negeri Makassar
            </h2>

            {/* CTA Button dengan Hover Animation */}
            <button
              className={`group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold mt-8 px-8 py-4 rounded-lg shadow-xl transform transition-all duration-1000 delay-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } hover:scale-110 hover:shadow-2xl hover:shadow-green-500/25`}
              onClick={() => (window.location.href = "/laporan")}>
              <span className="relative z-10">Lihat Laporan</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* News Section dengan Enhanced Design */}
      <section className="min-h-screen px-6 md:px-12 py-20 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-10 w-32 h-32 border-4 border-green-400 rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <div
            className="absolute bottom-20 right-10 w-24 h-24 border-4 border-green-300 rounded-full animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          />
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "1000+", label: "Jamaah Aktif", icon: "👥" },
            { number: "50+", label: "Kegiatan/Bulan", icon: "📅" },
            { number: "15", label: "Tahun Berdiri", icon: "🏛️" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transform transition-all duration-500 hover:scale-110 hover:bg-white/20 group ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}>
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-white font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center mt-16 mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300">
            📰 Berita Terbaru
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full mb-8" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={getBerita}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Berita Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {berita.map((item, index) => (
              <div
                key={item._id || index}
                className={`group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}>
                {/* Image Container */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=300&fit=crop"
                    }
                    alt={item.title || "Gambar Berita"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=300&fit=crop";
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    📅 {item.tanggal || formatDate(item.createdAt)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.content?.substring(0, 150)}...
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {item.author && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item.author}
                      </span>
                    )}
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  {/* Read More Button */}
                  <a
                    href={`/berita/${item._id}`}
                    className="group/btn inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-all duration-300">
                    <span>Baca Selengkapnya</span>
                    <svg
                      className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>

                {/* Bottom Highlight */}
                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        )}

        {/* View All News Button */}
        {!loading && !error && berita.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="/berita"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <span>Lihat Semua Berita</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}
      </section>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 z-50 group">
        <svg
          className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* Custom CSS untuk line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default DashboardView;
