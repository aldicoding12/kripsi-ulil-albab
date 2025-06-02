import React, { useState, useEffect } from "react";
import PDFDownloadModal from "../../components/PDFDownloadModal";

// Custom Hooks
import { useFinanceReport } from "../../hooks/useFinanceReport";
import { usePDFDownload } from "../../hooks/usePDFDownload";
import { useChart } from "../../hooks/useChart";

// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import RangeSelector from "../../components/RangeSelector";
import PDFDownloadButton from "../../components/PDFDownloadButton";
import FinancialSummary from "../../components/FinancialSummary";
import DataTable from "../../components/DataTable";
import ChartSection from "../../components/ChartSection";

// Utils & Constants
import { formatDate, formatCurrency } from "../../utils/formatters";
import { REPORT_RANGES } from "../../constants/reportConstants";

// ... import statements tetap sama

function LaporanView() {
  const [selectedRange, setSelectedRange] = useState("weekly");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const {
    reportData,
    loading,
    error: reportError,
    fetchReport,
  } = useFinanceReport();
  const { downloading, error: pdfError, downloadPDF } = usePDFDownload();
  const chartRef = useChart(reportData.chartData, selectedRange);

  const {
    incomes,
    expenses,
    totalIncome,
    totalExpense,
    saldoAwal,
    saldoAkhir,
    chartData,
  } = reportData;

  const error = reportError || pdfError;

  useEffect(() => {
    setIsVisible(true);
    const timer1 = setTimeout(() => setAnimationPhase(1), 200);
    const timer2 = setTimeout(() => setAnimationPhase(2), 400);
    const timer3 = setTimeout(() => setAnimationPhase(3), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    fetchReport(selectedRange);
  }, [selectedRange, fetchReport]);

  const incomeColumns = [
    { header: "Tanggal", key: "date", render: formatDate },
    { header: "Nama", key: "name" },
    { header: "Jumlah", key: "amount", align: "right", render: formatCurrency },
  ];

  const expenseColumns = [
    { header: "Tanggal", key: "date", render: formatDate },
    { header: "Keterangan", key: "name" },
    { header: "Jumlah", key: "amount", align: "right", render: formatCurrency },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header
        className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2 hover:text-green-800 transition-colors duration-300">
          Laporan Donasi Masjid
        </h1>
        <p className="text-sm md:text-base text-gray-600 hover:text-gray-800 transition-colors duration-300">
          Transparansi untuk Kepercayaan Jamaah
        </p>
      </header>

      {/* Controls */}
      <div
        className={`flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mb-6 text-center transition-all duration-700 ease-out delay-200 ${
          animationPhase >= 1
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}>
        <div className="transform hover:scale-105 transition-transform duration-200">
          <RangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <div className="transform hover:scale-105 transition-all duration-200 hover:shadow-lg">
            <PDFDownloadButton
              onDownload={downloadPDF}
              downloading={downloading}
              selectedRange={selectedRange}
              disabled={loading}
            />
          </div>
          <button
            className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transform hover:scale-105 transition-all duration-200 hover:shadow-lg active:scale-95"
            onClick={() => setShowPDFModal(true)}
            disabled={loading}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..."
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Opsi Lanjutan</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="animate-shake">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className={`flex flex-col md:flex-row gap-6 transition-all duration-700 ease-out delay-400 ${
            animationPhase >= 2
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}>
          <main className="flex-1 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="space-y-6">
              <div className="transform hover:scale-[1.01] transition-transform duration-200">
                <FinancialSummary
                  saldoAwal={saldoAwal}
                  saldoAkhir={saldoAkhir}
                  selectedRange={selectedRange}
                />
              </div>

              {/* Pemasukan */}
              <div className="overflow-x-auto transform hover:scale-[1.01] transition-transform duration-200">
                <DataTable
                  title="Pemasukan"
                  data={incomes}
                  columns={incomeColumns}
                  total={totalIncome}
                  totalLabel="Total Pemasukan"
                  headerColor="text-green-700"
                />
              </div>

              {/* Pengeluaran */}
              <div className="overflow-x-auto transform hover:scale-[1.01] transition-transform duration-200">
                <DataTable
                  title="Pengeluaran"
                  data={expenses}
                  columns={expenseColumns}
                  total={totalExpense}
                  totalLabel="Total Pengeluaran"
                  headerColor="text-red-700"
                />
              </div>

              <section className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex justify-between flex-wrap items-center gap-4">
                  <div className="text-lg font-bold text-gray-800">
                    Ringkasan:
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-gray-600">
                      Total Pemasukan:{" "}
                      <span className="font-semibold text-green-600">
                        {formatCurrency(totalIncome)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Pengeluaran:{" "}
                      <span className="font-semibold text-red-600">
                        {formatCurrency(totalExpense)}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-700 mt-1">
                      Saldo Akhir: {formatCurrency(saldoAkhir)}
                    </div>
                  </div>
                </div>
              </section>

              {/* PDF Buttons */}
              <section className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.01]">
                <h3 className="text-md font-semibold mb-3 text-blue-700">
                  📊 Download Laporan PDF
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(REPORT_RANGES).map(([key, label], index) => (
                    <button
                      key={key}
                      className={`px-3 py-2 text-sm rounded-lg text-white transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        downloading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg"
                      }`}
                      onClick={() => downloadPDF(key)}
                      disabled={downloading}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation:
                          animationPhase >= 3
                            ? "slideInUp 0.5s ease-out forwards"
                            : undefined,
                      }}>
                      📊 Laporan {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Klik tombol di atas untuk mengunduh laporan dalam format PDF
                </p>
              </section>
            </div>
          </main>

          <aside
            className={`w-full md:w-auto transition-all duration-700 ease-out delay-600 ${
              animationPhase >= 3
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}>
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <ChartSection
                chartRef={chartRef}
                chartData={chartData}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                selectedRange={selectedRange}
              />
            </div>
          </aside>
        </div>
      )}

      <PDFDownloadModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        selectedRange={selectedRange}
      />

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}

export default LaporanView;
