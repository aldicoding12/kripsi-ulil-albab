import { useState, useCallback } from "react";
import costumAPI from "../api";

export const useFinanceReport = () => {
  const [reportData, setReportData] = useState({
    incomes: [],
    expenses: [],
    totalIncome: 0,
    totalExpense: 0,
    saldoAwal: 0,
    saldoAkhir: 0,
    chartData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async (range) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await costumAPI.get(`/finance/report/${range}-auto`);

      if (!data?.data) {
        throw new Error("Invalid data format from API");
      }

      const apiData = data.data;
      const balanceData = apiData[`${range}Balance`] || [];

      setReportData({
        incomes: Array.isArray(apiData.incomes) ? apiData.incomes : [],
        expenses: Array.isArray(apiData.expenses) ? apiData.expenses : [],
        totalIncome: apiData.totalIncome || 0,
        totalExpense: apiData.totalExpense || 0,
        saldoAwal: apiData.saldoAwal || 0,
        saldoAkhir: apiData.saldoAkhir || 0,
        chartData: balanceData,
      });
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      setError("Gagal memuat data laporan. Silakan coba lagi.");
      setReportData({
        incomes: [],
        expenses: [],
        totalIncome: 0,
        totalExpense: 0,
        saldoAwal: 0,
        saldoAkhir: 0,
        chartData: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { reportData, loading, error, fetchReport };
};
