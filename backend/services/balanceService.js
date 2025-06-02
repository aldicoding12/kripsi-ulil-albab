import Balance from "../models/balanceModel.js";
import Income from "../models/incomesModel.js";
import Expense from "../models/expensesModel.js";

export const updateBalance = async (amount, isIncome = true) => {
  let balance = await Balance.findOne();
  if (!balance) {
    balance = new Balance({ amount: 0 });
  }

  balance.amount += isIncome ? amount : -amount;
  balance.updatedAt = new Date();
  await balance.save();

  return balance;
};

export const getBalanceBeforeDate = async (date) => {
  const [incomesBefore, expensesBefore] = await Promise.all([
    Income.aggregate([
      { $match: { date: { $lt: date } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $lt: date } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return (incomesBefore[0]?.total || 0) - (expensesBefore[0]?.total || 0);
};

export const getCurrentBalance = async () => {
  const balance = await Balance.findOne();
  return balance ? balance.amount : 0;
};
