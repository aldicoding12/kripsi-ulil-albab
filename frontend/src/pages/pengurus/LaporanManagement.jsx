/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PDFDownloadModal from "../../components/PDFDownloadModal";
import AddTransactionModal from "../../components/admin/componens/AddTransactionModal ";

// Custom Hooks
import { useFinanceReport } from "../../hooks/useFinanceReport";
import { usePDFDownload } from "../../hooks/usePDFDownload";
import { useChart } from "../../hooks/useChart";

// Components
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import FinancialSummary from "../../components/FinancialSummary";
import ChartSection from "../../components/ChartSection";

// Local Components
import LaporanHeader from "../../components/admin/componens/LaporanHeader ";
import LaporanControls from "../../components/admin/componens/LaporanControls ";
import TransactionTables from "../../components/admin/componens/TransactionTables";
import SummarySection from "../../components/admin/componens/SummarySection";
import PDFDownloadSection from "../../components/admin/componens/PDFDownloadSection";

// Utils & Constants
import { formatDate, formatCurrency } from "../../utils/formatters";
import { REPORT_RANGES } from "../../constants/reportConstants";
import {
  createIncome,
  createExpense,
  updateIncome,
  updateExpense,
  deleteIncome,
  deleteExpense,
} from "../../api";

function LaporanManagement() {
  const [selectedRange, setSelectedRange] = useState("weekly");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("income");
  const [editingItem, setEditingItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handler functions for actions
  const handleEditIncome = (item) => {
    console.log("Edit income:", item);
    if (!item) {
      alert("Data tidak valid untuk diedit");
      return;
    }

    setEditingItem(item);
    setModalType("income");
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleDeleteIncome = async (item) => {
    if (!item) {
      console.error("Item tidak valid:", item);
      alert("Data tidak valid untuk dihapus.");
      return;
    }

    const itemId = item._id || item.id;
    if (!itemId) {
      console.error("ID tidak ditemukan dalam item:", item);
      alert("ID tidak ditemukan.");
      return;
    }

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus pemasukan "${
          item.name || "item ini"
        }"?`
      )
    ) {
      try {
        await deleteIncome(itemId);
        setSuccessMessage("Pemasukan berhasil dihapus");
        await fetchReport(selectedRange);
      } catch (error) {
        console.error("Gagal menghapus pemasukan:", error);
        alert("Terjadi kesalahan saat menghapus pemasukan: " + error.message);
      }
    }
  };

  const handleEditExpense = (item) => {
    console.log("Edit expense:", item);
    if (!item) {
      alert("Data tidak valid untuk diedit");
      return;
    }

    setEditingItem(item);
    setModalType("expense");
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleDeleteExpense = async (item) => {
    if (!item) {
      console.error("Item tidak valid:", item);
      alert("Data tidak valid untuk dihapus.");
      return;
    }

    const itemId = item._id || item.id;
    if (!itemId) {
      console.error("ID tidak ditemukan dalam item:", item);
      alert("ID tidak ditemukan.");
      return;
    }

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus pengeluaran "${
          item.name || "item ini"
        }"?`
      )
    ) {
      try {
        await deleteExpense(itemId);
        setSuccessMessage("Pengeluaran berhasil dihapus");
        await fetchReport(selectedRange);
      } catch (error) {
        console.error("Gagal menghapus pengeluaran:", error);
        alert("Terjadi kesalahan saat menghapus pengeluaran: " + error.message);
      }
    }
  };

  const handleAddIncome = () => {
    setEditingItem(null);
    setModalType("income");
    setIsEditMode(false);
    setShowAddModal(true);
  };

  const handleAddExpense = () => {
    setEditingItem(null);
    setModalType("expense");
    setIsEditMode(false);
    setShowAddModal(true);
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      const { name, amount, date, description = "", type } = transactionData;
      const apiData = { name, amount, date, description };

      let response;
      if (isEditMode && editingItem) {
        // Update existing transaction
        const itemId = editingItem._id || editingItem.id;
        response =
          type === "income"
            ? await updateIncome(itemId, apiData)
            : await updateExpense(itemId, apiData);

        setSuccessMessage(
          type === "income"
            ? "Pemasukan berhasil diperbarui!"
            : "Pengeluaran berhasil diperbarui!"
        );
      } else {
        // Create new transaction
        response =
          type === "income"
            ? await createIncome(apiData)
            : await createExpense(apiData);

        setSuccessMessage(
          type === "income"
            ? "Pemasukan berhasil ditambahkan!"
            : "Pengeluaran berhasil ditambahkan!"
        );
      }

      console.log("Transaction saved successfully:", response);
      await fetchReport(selectedRange);

      // Reset modal state
      setEditingItem(null);
      setIsEditMode(false);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Terjadi kesalahan: " + error.message);
      throw error;
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setIsEditMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <LaporanHeader isVisible={isVisible} />

      <LaporanControls
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        onDownload={downloadPDF}
        downloading={downloading}
        loading={loading}
        onShowPDFModal={() => setShowPDFModal(true)}
        animationPhase={animationPhase}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md animate-pulse">
          {successMessage}
        </div>
      )}

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

              <TransactionTables
                incomes={incomes}
                expenses={expenses}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                onEditIncome={handleEditIncome}
                onDeleteIncome={handleDeleteIncome}
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense}
                onAddIncome={handleAddIncome}
                onAddExpense={handleAddExpense}
              />

              <SummarySection
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                saldoAkhir={saldoAkhir}
              />

              <PDFDownloadSection
                downloadPDF={downloadPDF}
                downloading={downloading}
                animationPhase={animationPhase}
              />
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

      {/* Modals */}
      <PDFDownloadModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        selectedRange={selectedRange}
      />

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onSubmit={handleTransactionSubmit}
        type={modalType}
        editData={editingItem}
        isEditMode={isEditMode}
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

export default LaporanManagement;
