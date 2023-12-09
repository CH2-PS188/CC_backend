const { pool } = require("../db/db");

const getNextTransaksiId = async () => {
  try {
    const result = await pool.query(
      "SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM  transaksi"
    );
    const nextId = result.rows[0].next_id;
    return nextId;
  } catch (error) {
    console.error("Error getting next  transaksiID:", error);
    throw error;
  }
};

const addTransaksi = async (req, res) => {
  try {
    // Extract data from the request body
    const { date, account, total, title, category, description } = req.body;
    // Get the next available ID for transaksi
    const transaksiId = await getNextTransaksiId();
    // Extract id_account from the URL path
    const id_account = req.params.id_account;
    // Determine the type based on the URL
    const type = req.url.includes("/transaksi/pengeluaran")
      ? "pengeluaran"
      : "pemasukan";
    // Insert data into the 'transaksi' table
    const resultTransaksi = await pool.query(
      "INSERT INTO transaksi (id, id_account, date, account, total, title, category, description, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [
        transaksiId,
        id_account,
        date,
        account,
        total,
        title,
        category,
        description,
        type,
      ]
    );
    res.status(200).json({
      message: "Transaksi added successfully",
      result: resultTransaksi.rows[0],
    });
  } catch (error) {
    console.error("Error adding transaksi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllTransaksi = async (req, res) => {
  try {
    const id_account = req.params.id_account;
    const result = await pool.query(
      "SELECT * FROM transaksi WHERE id_account = $1 ORDER BY date",
      [id_account]
    );
    // Adjust the 'total' property based on the 'type' (income or expense)
    const finalreturn = result.rows.map((transaction) => ({
      ...transaction,
      total:
        transaction.type === "pemasukan"
          ? "+ " + transaction.total
          : "- " + transaction.total, // Show absolute value for expenses
    }));
    // Check if there are no transactions found for the specific account
    if (finalreturn.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for the specified account" });
    }

    res.status(200).json({ data: finalreturn });
  } catch (error) {
    console.error(
      "Error fetching transactions for the specified account:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTransaksiById = async (req, res) => {
  try {
    const { id_account, id } = req.params;

    // Fetch transaction by ID and id_account
    const result = await pool.query(
      "SELECT * FROM transaksi WHERE id = $1 AND id_account = $2",
      [id, id_account]
    );

    // Check if the transaction with the specified ID and id_account is not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `Transaction with id ${id} not found for the specified account`,
      });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error(
      "Error fetching transaction by ID for the specified account:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTransaksiById = async (req, res) => {
  try {
    const { id_account, id } = req.params;
    // Extract data from the request body
    const { date, account, total, title, category, description, type } =
      req.body;
    // Update the transaction in the 'transaksi' table for the specified account and return the updated data
    const result = await pool.query(
      "UPDATE transaksi SET date = $1, account = $2, total = $3, title = $4, category = $5, description = $6 WHERE id = $7 AND id_account = $8 RETURNING *",
      [date, account, total, title, category, description, id, id_account]
    );
    // Check if the transaction was found and updated
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `Transaction with id ${id} not found for the specified account`,
      });
    }
    res.status(200).json({
      message: "Transaction updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error updating transaction by ID for the specified account:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTransaksiById = async (req, res) => {
  try {
    const { id_account, id } = req.params;
    // Delete the transaction from the 'transaksi' table for the specified account
    const result = await pool.query(
      "DELETE FROM transaksi WHERE id = $1 AND id_account = $2 RETURNING *",
      [id, id_account]
    );
    // Check if the transaction was found and deleted
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `Transaction with id ${id} not found for the specified account`,
      });
    }
    res.status(200).json({
      message: "Transaction deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error deleting transaction by ID for the specified account:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addTransaksi,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksiById,
  deleteTransaksiById,
};
