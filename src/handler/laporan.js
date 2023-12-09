const { pool } = require("../db/db");

const getAlllaporan = async (req, res) => {
  try {
    const { id_account } = req.params;
    // Get the current date
    const currentDate = new Date();
    // Extract the current year and month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Month is zero-indexed, so we add 1
    // Calculate the start and end dates for the current month
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(new Date(year, month, 0)); // Last day of the month
    const result = await pool.query(
      "SELECT * FROM transaksi WHERE date >= $1 AND date <= $2 AND id_account = $3",
      [startDate, endDate, id_account]
    );
    const transactions = result.rows;
    if (transactions.length === 0) {
      return res.status(404).json({
        error: "No transactions found for the specified user and month",
      });
    }
    // Calculate total income, total expenses, and the difference
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "pemasukan") {
        totalIncome += parseFloat(transaction.total);
      } else if (transaction.type === "pengeluaran") {
        totalExpenses += parseFloat(transaction.total);
      }
    });
    const difference = totalIncome - totalExpenses;
    const total = totalIncome + totalExpenses;
    // Format the start and end dates in the desired format
    const monthName = new Intl.DateTimeFormat("id-ID", {
      month: "short",
    }).format(startDate);
    const formattedStartDate = `01 ${monthName} ${year}`;
    const formattedEndDate = `${endDate.getDate()} ${monthName} ${year}`;
    const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
    res.status(200).json({
      summary: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        Date: formattedDateRange,
        totalIncome: `+ ${totalIncome}`,
        totalExpenses: `- ${totalExpenses}`,
        difference: `+ ${difference}`,
        total,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching transactions and summary for the specified user and month:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getdetaillaporan = async (req, res) => {
  try {
    const { id_account } = req.params;
    // Get the current date
    const currentDate = new Date();
    // Extract the current year and month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Month is zero-indexed, so we add 1
    // Calculate the start and end dates for the current month
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(new Date(year, month, 0)); // Last day of the month
    const result = await pool.query(
      "SELECT * FROM transaksi WHERE date >= $1 AND date <= $2 AND id_account = $3",
      [startDate, endDate, id_account]
    );
    const transactions = result.rows;
    if (transactions.length === 0) {
      return res.status(404).json({
        error: "No transactions found for the specified user and month",
      });
    }
    // Calculate total income, total expenses, and the difference
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "pemasukan") {
        totalIncome += parseFloat(transaction.total);
      } else if (transaction.type === "pengeluaran") {
        totalExpenses += parseFloat(transaction.total);
      }
    });
    const difference = totalIncome - totalExpenses;
    const total = totalIncome + totalExpenses;
    // Calculate the number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Calculate average daily income and expenses
    const averageDailyIncome = totalIncome / daysInMonth;
    const averageDailyExpenses = totalExpenses / daysInMonth;
    // Format the start and end dates in the desired format
    const monthName = new Intl.DateTimeFormat("id-ID", {
      month: "short",
    }).format(startDate);
    const formattedStartDate = `01 ${monthName} ${year}`;
    const formattedEndDate = `${endDate.getDate()} ${monthName} ${year}`;
    const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
    res.status(200).json({
      summary: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        dateRange: formattedDateRange,
        totalIncome: `+ ${totalIncome}`,
        totalExpenses: `- ${totalExpenses}`,
        difference: `+ ${difference}`,
        total,
        averageDailyIncome: `+ ${averageDailyIncome.toFixed(2)}`,
        averageDailyExpenses: `- ${averageDailyExpenses.toFixed(2)}`,
      },
      pemasukanData: transactions.filter(
        (transaction) => transaction.type === "pemasukan"
      ),
      pengeluaranData: transactions.filter(
        (transaction) => transaction.type === "pengeluaran"
      ),
    });
  } catch (error) {
    console.error(
      "Error fetching transactions and summary for the specified user and month:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getAlllaporan, getdetaillaporan };
