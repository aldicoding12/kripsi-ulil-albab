import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Image as ImageIcon,
  Loader,
} from "lucide-react";

import customAPI from "../../api";
import NewsModal from "../../components/admin/componens/NewsComponents/NewsModal ";
import NewsViewModal from "../../components/admin/componens/NewsComponents/NewsViewModal ";

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get all news
  const getNews = async () => {
    setIsLoading(true);
    try {
      const { data } = await customAPI.get("/news");
      setNews(data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert(
        "Gagal memuat berita: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (editingNews) {
        // Update existing news
        const { data } = await customAPI.put(
          `/news/${editingNews._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setNews((prevNews) =>
          prevNews.map((item) =>
            item._id === editingNews._id ? data.data : item
          )
        );
        alert("Berita berhasil diperbarui!");
      } else {
        // Create new news
        const { data } = await customAPI.post("/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setNews((prevNews) => [data.data, ...prevNews]);
        alert("Berita berhasil ditambahkan!");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving news:", error);
      alert(
        "Gagal menyimpan berita: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (newsItem = null) => {
    setEditingNews(newsItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
  };

  const handleEdit = (item) => {
    handleOpenModal(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      setIsLoading(true);
      try {
        await customAPI.delete(`/news/${id}`);
        setNews((prevNews) => prevNews.filter((item) => item._id !== id));
        alert("Berita berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting news:", error);
        alert(
          "Gagal menghapus berita: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleView = (item) => {
    setViewingNews(item);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingNews(null);
  };

  const filteredNews = news.filter((item) => {
    const matchSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manajemen Berita
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola semua konten berita Anda
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
              Tambah Berita
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari berita atau penulis..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading && news.length === 0 && (
            <div className="flex justify-center items-center p-8">
              <Loader size={32} className="animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Memuat berita...</span>
            </div>
          )}

          {(!isLoading || news.length > 0) && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Berita
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penulis
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {item.image ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover mr-4"
                              src={item.image}
                              alt={item.title}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="h-16 w-16 rounded-lg bg-gray-200 mr-4 flex items-center justify-center"
                            style={{ display: item.image ? "none" : "flex" }}>
                            <ImageIcon size={24} className="text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {stripHtml(item.content).substring(0, 100)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <User size={16} className="mr-2 text-gray-400" />
                          {item.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Lihat">
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 disabled:text-green-400 transition-colors"
                            title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:text-red-400 transition-colors"
                            title="Hapus">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredNews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Tidak ada berita yang ditemukan
              </div>
              <p className="text-gray-400 mt-2">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian Anda"
                  : "Mulai dengan menambahkan berita baru"}
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        <NewsModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          editingNews={editingNews}
          isLoading={isLoading}
        />

        <NewsViewModal
          isOpen={showViewModal}
          onClose={handleCloseViewModal}
          news={viewingNews}
        />
      </div>
    </div>
  );
}

export default NewsManagement;
