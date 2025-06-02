import { useState, useCallback } from "react";
import costumAPI from "../api";
import { REPORT_RANGES } from "../constants/reportConstants";

export const usePDFDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const downloadPDF = useCallback(async (reportType) => {
    setDownloading(true);
    setError(null);

    try {
      const endpoints = {
        weekly: "/finance/report/weekly/pdf",
        monthly: "/finance/report/monthly/pdf",
        yearly: "/finance/report/yearly/pdf",
      };

      const currentDate = new Date().toISOString().split("T")[0];
      const currentYear = new Date().getFullYear();

      const params =
        reportType === "yearly"
          ? { start: `${currentYear}-01-01`, end: `${currentYear}-12-31` }
          : { date: currentDate };

      const response = await costumAPI.get(endpoints[reportType], {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const filename = `Laporan-${REPORT_RANGES[reportType]}-${
        reportType === "yearly" ? currentYear : currentDate
      }.pdf`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log(`PDF ${reportType} berhasil diunduh`);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError(
        `Gagal mengunduh PDF ${REPORT_RANGES[reportType]}. Silakan coba lagi.`
      );
    } finally {
      setDownloading(false);
    }
  }, []);

  return { downloading, error, downloadPDF };
};
