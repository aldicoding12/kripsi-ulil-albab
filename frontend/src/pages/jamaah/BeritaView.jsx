/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import costumAPI from "../../api";

function BeritaView() {
  const [berita, setBerita] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBerita, setFilteredBerita] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getBerita = async () => {
    try {
      // Uncomment dan gunakan API call Anda
      const { data } = await costumAPI.get("/news");

      // Sort berita berdasarkan tanggal terbaru
      const sortedBerita = data.data.sort((a, b) => {
        return (
          new Date(b.createdAt || b.tanggal) -
          new Date(a.createdAt || a.tanggal)
        );
      });

      setBerita(sortedBerita);
      console.log(data);

      // Simulasi loading - hapus ini ketika menggunakan API real
      setTimeout(() => {
        setIsLoading(false);
        setIsVisible(true);
      }, 100);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBerita();
  }, []);

  // Filter berita berdasarkan search term
  useEffect(() => {
    const filtered = berita.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBerita(filtered);
    // Reset ke halaman pertama ketika melakukan pencarian
    setCurrentPage(1);
  }, [berita, searchTerm]);

  // Get current items untuk pagination
  const getCurrentItems = () => {
    const itemsToShow = searchTerm ? filteredBerita : berita;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return itemsToShow.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const itemsToShow = searchTerm ? filteredBerita : berita;
    return Math.ceil(itemsToShow.length / itemsPerPage);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll ke atas ketika ganti halaman
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 6) {
        for (let i = 1; i <= 7; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 6; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Loading Animation Component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div className="w-full h-56 bg-gray-300"></div>
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    const totalPages = getTotalPages();
    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-12">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-green-600 hover:bg-green-50 hover:text-green-700 shadow-md hover:shadow-lg"
          }`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((number, index) => (
          <React.Fragment key={index}>
            {number === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(number)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === number
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-green-600 hover:bg-green-50 hover:text-green-700 shadow-md hover:shadow-lg"
                }`}>
                {number}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-green-600 hover:bg-green-50 hover:text-green-700 shadow-md hover:shadow-lg"
          }`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  };

  const currentItems = getCurrentItems();
  const totalPages = getTotalPages();
  const itemsToShow = searchTerm ? filteredBerita : berita;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-800 via-green-700 to-green-600 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <div
            className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1
            className={`text-5xl md:text-6xl font-bold text-white mb-6 transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}>
            📰 BERITA
            <span className="block text-green-200 mt-2 relative">
              TERKINI
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full mt-2"></div>
            </span>
          </h1>

          <p
            className={`text-xl text-green-100 mb-8 transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}>
            Ikuti perkembangan kegiatan dan informasi terkini dari Masjid Ulil
            Albab
          </p>

          {/* Search Bar */}
          <div
            className={`max-w-md mx-auto transform transition-all duration-1000 delay-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-6 h-6 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-8 text-center">
              {searchTerm ? (
                <p className="text-gray-600">
                  Menampilkan {itemsToShow.length} hasil untuk "
                  <span className="font-semibold text-green-600">
                    {searchTerm}
                  </span>
                  "
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Menampilkan {currentItems.length} dari {itemsToShow.length}{" "}
                    berita terkini
                  </p>
                  <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                    <span>
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    {totalPages > 1 && (
                      <>
                        <span>•</span>
                        <span>{itemsPerPage} berita per halaman</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Berita Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((item, index) => (
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
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      📅 {item.tanggal}
                    </div>

                    {/* New Badge untuk berita terbaru */}
                    {index < 3 && !searchTerm && currentPage === 1 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        BARU
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.content?.substring(0, 150)}...
                    </p>

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

            {/* Pagination */}
            <Pagination />

            {/* Empty State */}
            {itemsToShow.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  {searchTerm ? "Berita tidak ditemukan" : "Belum ada berita"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Coba kata kunci lain"
                    : "Berita akan segera hadir"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 z-50">
        <svg
          className="w-6 h-6"
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
    </div>
  );
}

export default BeritaView;
