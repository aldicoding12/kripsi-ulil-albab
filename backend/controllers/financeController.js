import asyncHandler from "../middlewares/asyncHandler.js";
import { validateDate } from "../utils/dateUtils.js";
import { debugLog, logError } from "../utils/debugUtils.js";
import { updateBalance } from "../services/balanceService.js";
import {
  createIncome,
  createExpense,
  updateIncome,
  updateExpense,
  deleteIncome,
  deleteExpense,
  getIncomeById,
  getExpenseById,
} from "../services/transactionService.js";
import {
  generateWeeklyReportData,
  generateMonthlyReportData,
  generateYearlyReportData,
} from "../services/reportService.js";
import { handlePDFResponse, generatePDFFilename } from "../utils/pdfUtils.js";
import {
  generateWeeklyReportPDF,
  generateMonthlyReportPDF,
  generateYearlyReportPDF,
} from "../utils/pdfGenerator.js";

// ===== TRANSACTION CONTROLLERS =====

// ✅ CREATE INCOME
export const addIncome = asyncHandler(async (req, res) => {
  try {
    const newIncome = await createIncome(req.body);
    const balance = await updateBalance(newIncome.amount, true);

    res.status(201).json({
      message: "Pemasukan berhasil ditambahkan dan saldo diperbarui",
      data: newIncome,
      currentBalance: balance.amount,
    });
  } catch (error) {
    logError("Add Income", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ CREATE EXPENSE
export const addExpense = asyncHandler(async (req, res) => {
  try {
    const newExpense = await createExpense(req.body);
    const balance = await updateBalance(newExpense.amount, false);

    res.status(201).json({
      message: "Pengeluaran berhasil ditambahkan dan saldo diperbarui",
      data: newExpense,
      currentBalance: balance.amount,
    });
  } catch (error) {
    logError("Add Expense", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ UPDATE INCOME
export const editIncome = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Get the original income data to calculate balance difference
    const originalIncome = await getIncomeById(id);
    if (!originalIncome) {
      return res.status(404).json({ message: "Pemasukan tidak ditemukan" });
    }

    // Update the income
    const updatedIncome = await updateIncome(id, req.body);

    // Calculate balance adjustment
    const balanceDifference = updatedIncome.amount - originalIncome.amount;
    if (balanceDifference !== 0) {
      await updateBalance(Math.abs(balanceDifference), balanceDifference > 0);
    }

    res.status(200).json({
      message: "Pemasukan berhasil diperbarui",
      data: updatedIncome,
    });
  } catch (error) {
    logError("Update Income", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ UPDATE EXPENSE
export const editExpense = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Data dikirim dari frontend:", req.body);
    console.log("ID pengeluaran:", id);

    // Get the original expense data to calculate balance difference
    const originalExpense = await getExpenseById(id);
    if (!originalExpense) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    // Update the expense
    const updatedExpense = await updateExpense(id, req.body);

    // Calculate balance adjustment
    const balanceDifference = originalExpense.amount - updatedExpense.amount;
    if (balanceDifference !== 0) {
      await updateBalance(Math.abs(balanceDifference), balanceDifference > 0);
    }

    res.status(200).json({
      message: "Pengeluaran berhasil diperbarui",
      data: updatedExpense,
    });
  } catch (error) {
    logError("Update Expense", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE INCOME
export const removeIncome = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Get the income data before deletion to adjust balance
    const incomeToDelete = await getIncomeById(id);
    if (!incomeToDelete) {
      return res.status(404).json({ message: "Pemasukan tidak ditemukan" });
    }

    // Delete the income
    await deleteIncome(id);

    // Adjust balance (subtract the income amount from balance)
    await updateBalance(incomeToDelete.amount, false);

    res.status(200).json({
      message: "Pemasukan berhasil dihapus dan saldo diperbarui",
      deletedData: incomeToDelete,
    });
  } catch (error) {
    logError("Delete Income", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE EXPENSE
export const removeExpense = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Get the expense data before deletion to adjust balance
    const expenseToDelete = await getExpenseById(id);
    if (!expenseToDelete) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    // Delete the expense
    await deleteExpense(id);

    // Adjust balance (add the expense amount back to balance)
    await updateBalance(expenseToDelete.amount, true);

    res.status(200).json({
      message: "Pengeluaran berhasil dihapus dan saldo diperbarui",
      deletedData: expenseToDelete,
    });
  } catch (error) {
    logError("Delete Expense", error);
    res.status(400).json({ message: error.message });
  }
});

// ===== REPORT CONTROLLERS =====

export const weeklyReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const refDate = validateDate(date) || new Date();

  if (!refDate) {
    return res.status(400).json({ message: "Format tanggal tidak valid" });
  }

  refDate.setHours(0, 0, 0, 0);

  try {
    const reportData = await generateWeeklyReportData(refDate);

    res.status(200).json({
      message: `Laporan mingguan yang mengandung tanggal ${
        refDate.toISOString().split("T")[0]
      } berhasil diambil`,
      data: reportData,
    });
  } catch (error) {
    logError("Weekly Report", error);
    res.status(500).json({ message: "Gagal mengambil laporan mingguan" });
  }
});

export const monthlyReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const refDate = validateDate(date) || new Date();

  if (!refDate) {
    return res.status(400).json({ message: "Format tanggal tidak valid" });
  }

  try {
    const reportData = await generateMonthlyReportData(refDate);

    res.status(200).json({
      message: `Laporan bulanan yang mengandung tanggal ${
        refDate.toISOString().split("T")[0]
      } berhasil diambil`,
      data: reportData,
    });
  } catch (error) {
    logError("Monthly Report", error);
    res.status(500).json({ message: "Gagal mengambil laporan bulanan" });
  }
});

export const yearlyReport = asyncHandler(async (req, res) => {
  const { start, end } = req.query;

  const startDate =
    validateDate(start) || new Date(new Date().getFullYear(), 0, 1);
  const endDate =
    validateDate(end) ||
    new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Format tanggal tidak valid" });
  }

  try {
    const reportData = await generateYearlyReportData(startDate, endDate);

    res.status(200).json({
      message: "Laporan multi-tahun berhasil diambil",
      data: reportData,
    });
  } catch (error) {
    logError("Yearly Report", error);
    res.status(500).json({ message: "Gagal mengambil laporan tahunan" });
  }
});

// ===== PDF CONTROLLERS =====

export const weeklyReportPDF = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const refDate = validateDate(date) || new Date();

  if (!refDate) {
    return res.status(400).json({ message: "Format tanggal tidak valid" });
  }

  refDate.setHours(0, 0, 0, 0);

  try {
    const reportData = await generateWeeklyReportData(refDate);
    const pdfBuffer = await generateWeeklyReportPDF(reportData);
    const filename = generatePDFFilename("weekly", refDate);

    handlePDFResponse(res, pdfBuffer, filename);
  } catch (error) {
    logError("Weekly PDF", error);
    res.status(500).json({
      message: "Gagal membuat PDF laporan mingguan",
      error: error.message,
    });
  }
});

export const monthlyReportPDF = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const refDate = validateDate(date) || new Date();

  if (!refDate) {
    return res.status(400).json({ message: "Format tanggal tidak valid" });
  }

  try {
    const reportData = await generateMonthlyReportData(refDate);
    const pdfBuffer = await generateMonthlyReportPDF(reportData);
    const filename = generatePDFFilename("monthly", refDate);

    handlePDFResponse(res, pdfBuffer, filename);
  } catch (error) {
    logError("Monthly PDF", error);
    res.status(500).json({
      message: "Gagal membuat PDF laporan bulanan",
      error: error.message,
    });
  }
});

export const yearlyReportPDF = asyncHandler(async (req, res) => {
  const { start, end } = req.query;

  const startDate =
    validateDate(start) || new Date(new Date().getFullYear(), 0, 1);
  const endDate =
    validateDate(end) ||
    new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Format tanggal tidak valid" });
  }

  try {
    const reportData = await generateYearlyReportData(startDate, endDate);
    const pdfBuffer = await generateYearlyReportPDF(reportData);
    const filename = generatePDFFilename(
      "yearly",
      null,
      startDate.getFullYear(),
      endDate.getFullYear()
    );

    handlePDFResponse(res, pdfBuffer, filename);
  } catch (error) {
    logError("Yearly PDF", error);
    res.status(500).json({
      message: "Gagal membuat PDF laporan tahunan",
      error: error.message,
    });
  }
});
