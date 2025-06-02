/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from "react";
import costumAPI from "../api";

const PDFDownloadModal = ({ isOpen, onClose, selectedRange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    specificDate: "",
  });
  const [error, setError] = useState("");

  // Set default dates based on current date
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    if (selectedRange === "weekly") {
      setDateRange((prev) => ({
        ...prev,
        specificDate: currentDate,
      }));
    } else if (selectedRange === "monthly") {
      setDateRange((prev) => ({
        ...prev,
        specificDate: currentDate,
      }));
    } else if (selectedRange === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      const endOfYear = new Date(now.getFullYear(), 11, 31)
        .toISOString()
        .split("T")[0];
      setDateRange((prev) => ({
        ...prev,
        startDate: startOfYear,
        endDate: endOfYear,
      }));
    }
  }, [selectedRange, isOpen]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setError("");

    try {
      let endpoint = "";
      let params = {};
      let filename = "";

      switch (selectedRange) {
        case "weekly":
          if (!dateRange.specificDate) {
            throw new Error("Silakan pilih tanggal untuk laporan mingguan");
          }
          endpoint = "/finance/report/weekly/pdf";
          params = { date: dateRange.specificDate };
          filename = `Laporan-Mingguan-${dateRange.specificDate}.pdf`;
          break;

        case "monthly":
          if (!dateRange.specificDate) {
            throw new Error("Silakan pilih tanggal untuk laporan bulanan");
          }
          endpoint = "/finance/report/monthly/pdf";
          params = { date: dateRange.specificDate };
          // eslint-disable-next-line no-case-declarations
          const monthYear = new Date(dateRange.specificDate).toLocaleDateString(
            "id-ID",
            {
              year: "numeric",
              month: "long",
            }
          );
          filename = `Laporan-Bulanan-${monthYear}.pdf`;
          break;

        case "yearly":
          if (!dateRange.startDate || !dateRange.endDate) {
            throw new Error(
              "Silakan pilih rentang tanggal untuk laporan tahunan"
            );
          }
          endpoint = "/finance/report/yearly/pdf";
          params = {
            start: dateRange.startDate,
            end: dateRange.endDate,
          };
          const startYear = new Date(dateRange.startDate).getFullYear();
          const endYear = new Date(dateRange.endDate).getFullYear();
          filename =
            startYear === endYear
              ? `Laporan-Tahunan-${startYear}.pdf`
              : `Laporan-Tahunan-${startYear}-${endYear}.pdf`;
          break;

        default:
          throw new Error("Tipe laporan tidak valid");
      }

      const response = await costumAPI.get(endpoint, {
        params,
        responseType: "blob",
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers if available
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Close modal after successful download
      onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError(error.message || `Gagal mengunduh PDF ${selectedRange}`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Download Laporan{" "}
            {selectedRange === "weekly"
              ? "Mingguan"
              : selectedRange === "monthly"
              ? "Bulanan"
              : "Tahunan"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDownloading}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {selectedRange === "yearly" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isDownloading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isDownloading}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedRange === "weekly"
                  ? "Pilih Tanggal (Minggu yang mengandung tanggal ini)"
                  : "Pilih Tanggal (Bulan yang mengandung tanggal ini)"}
              </label>
              <input
                type="date"
                value={dateRange.specificDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    specificDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isDownloading}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
            <p>
              {selectedRange === "weekly" &&
                "Laporan mingguan akan mencakup 7 hari yang berakhir pada tanggal yang dipilih."}
              {selectedRange === "monthly" &&
                "Laporan bulanan akan mencakup seluruh bulan dari tanggal yang dipilih."}
              {selectedRange === "yearly" &&
                "Laporan tahunan akan mencakup rentang tanggal yang dipilih."}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            disabled={isDownloading}>
            Batal
          </button>
          <button
            onClick={handleDownloadPDF}
            className={`flex-1 px-4 py-2 text-white rounded-md flex items-center justify-center gap-2 ${
              isDownloading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isDownloading}>
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Mengunduh...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFDownloadModal;
