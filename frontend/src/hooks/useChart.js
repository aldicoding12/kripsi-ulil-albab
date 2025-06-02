import { useRef, useEffect, useCallback } from "react";
import { Chart } from "chart.js/auto";
import { CHART_COLORS } from "../constants/reportConstants";

export const useChart = (chartData, selectedRange) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const prepareChartData = useCallback((data, range) => {
    if (!data.length) return { labels: [], datasets: [] };

    let labels, incomeValues, expenseValues, balanceValues;

    if (range === "yearly") {
      labels = data.map((item) => item.year || "N/A");
    } else {
      labels = data.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      });
    }

    incomeValues = data.map((item) => item.income || 0);
    expenseValues = data.map((item) => item.expense || 0);
    balanceValues = data.map((item) => item.balance || 0);

    return {
      labels,
      datasets: [
        {
          label: "Saldo",
          data: balanceValues,
          borderColor: CHART_COLORS.balance.border,
          backgroundColor: CHART_COLORS.balance.background,
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          order: 1,
        },
        {
          label: "Pemasukan",
          data: incomeValues,
          borderColor: CHART_COLORS.income.border,
          backgroundColor: CHART_COLORS.income.background,
          borderWidth: 1,
          tension: 0.1,
          borderDash: [5, 5],
          fill: false,
          order: 2,
        },
        {
          label: "Pengeluaran",
          data: expenseValues,
          borderColor: CHART_COLORS.expense.border,
          backgroundColor: CHART_COLORS.expense.background,
          borderWidth: 1,
          tension: 0.1,
          borderDash: [5, 5],
          fill: false,
          order: 3,
        },
      ],
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !chartData.length) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = chartRef.current.getContext("2d");
    const chartConfig = prepareChartData(chartData, selectedRange);

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: chartConfig,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(context.parsed.y);
                return `${label}: ${value}`;
              },
            },
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: false,
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
        animation: { duration: 500 },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData, selectedRange, prepareChartData]);

  return chartRef;
};

// 📁 src/utils/formatters.js
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
