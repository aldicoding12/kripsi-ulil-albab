import React from "react";
import { REPORT_RANGES } from "../constants/reportConstants";
import { formatCurrency } from "../utils/formatters";

const ChartSection = ({
  chartRef,
  chartData,
  totalIncome,
  totalExpense,
  selectedRange,
}) => (
  <div className="w-full bg-white p-6 rounded shadow">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">
      Grafik Keuangan
    </h2>

    <div className="h-64">
      {chartData.length > 0 ? (
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Data tidak tersedia untuk ditampilkan dalam grafik
        </div>
      )}
    </div>

    {chartData.length > 0 && (
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-2">
          Statistik {REPORT_RANGES[selectedRange]}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xs text-gray-500">Total Pemasukan</div>
            <div className="font-medium text-blue-600">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-xs text-gray-500">Total Pengeluaran</div>
            <div className="font-medium text-red-600">
              {formatCurrency(totalExpense)}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default ChartSection;
