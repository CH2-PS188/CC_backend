const { pool } = require("../db/db");
// Fungsi untuk mendapatkan ID rekening berikutnya
const getNextRekeningId = async () => {
  try {
    // Get the last ID from the rekening table
    const result = await pool.query("SELECT MAX(id) AS last_id FROM rekening");
    // Check if result.rows is not empty
    if (result && result.rows && result.rows.length > 0) {
      const lastRekening = result.rows[0];
      let rekeningId;
      // If there is data, use the last_id incremented by 1; otherwise, use 1 as the starting ID
      if (lastRekening.last_id !== null) {
        rekeningId = lastRekening.last_id + 1;
      } else {
        rekeningId = 1;
      }
      return rekeningId;
    } else {
      console.error("No rows returned from SELECT MAX(id)");
      throw new Error("No rows returned from SELECT MAX(id)");
    }
  } catch (error) {
    console.error("Error getting next rekening ID:", error);
    throw error;
  }
};

const addRekening = async (req, res) => {
  try {
    const { id_account } = req.params;
    const { judul, saldo } = req.body;
    const rekeningId = await getNextRekeningId();
    // Use RETURNING to get the newly inserted row
    const result = await pool.query(
      "INSERT INTO rekening (id, id_account ,judul, saldo) VALUES ($1, $2, $3,$4) RETURNING id, id_account , judul , saldo",
      [rekeningId, id_account, judul, saldo]
    );
    // Check if the result is not empty
    if (result && result.rowCount > 0) {
      res.status(200).json({
        message: "Rekening added successfully",
      });
    } else {
      console.error("No rows returned after INSERT");
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error adding rekening:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllRekening = async (req, res) => {
  try {
    const { id_account } = req.params;
    // Retrieve rekenings and calculate total saldo associated with the specified id_account
    const result = await pool.query(
      "SELECT *, SUM(saldo) OVER () AS total_saldo FROM rekening WHERE id_account = $1 ORDER BY id",
      [id_account]
    );

    const rows = result.rows;
    if (rows.length === 0) {
      res
        .status(404)
        .json({ error: "No rekenings found for the specified account" });
    } else {
      // Extract the total saldo from the first row (since it will be the same for all rows)
      const totalSaldo = rows[0].total_saldo;

      // Remove the total_saldo property from each row before sending the response
      const rekeningsWithoutTotalSaldo = rows.map(
        ({ total_saldo, ...row }) => row
      );
      res.status(200).json({
        rekenings: rekeningsWithoutTotalSaldo,
        totalSaldo: totalSaldo,
      });
    }
  } catch (error) {
    console.error("Error getting rekenings for the specified account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRekeningById = async (req, res) => {
  const { id_account, id } = req.params;
  try {
    // Retrieve a rekening by ID and id_account from the database using parameterized query
    const result = await pool.query(
      "SELECT * FROM rekening WHERE id = $1 AND id_account = $2",
      [id, id_account]
    );
    const rows = result.rows;
    if (rows.length === 0) {
      res
        .status(404)
        .json({ error: "Rekening not found for the specified account" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error("Error getting rekening by ID and account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editRekeningById = async (req, res) => {
  try {
    const rekeningId = req.params.id;
    const { judul, saldo } = req.body;
    // Update a rekening by ID in the database and return the updated data
    const result = await pool.query(
      "UPDATE rekening SET judul = $1, saldo = $2 WHERE id = $3 RETURNING id, judul, saldo",
      [judul, saldo, rekeningId]
    );

    // Check if the rekening was found and updated
    if (result.rowCount === 0) {
      res
        .status(404)
        .json({ error: "Rekening not found or no changes applied" });
    } else {
      res.status(200).json({
        message: "Rekening updated successfully",
      });
    }
  } catch (error) {
    console.error("Error editing rekening by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteRekeningById = async (req, res) => {
  try {
    const rekeningId = req.params.id;
    // Delete a rekening by ID from the database
    const result = await pool.query("DELETE FROM rekening WHERE id = $1", [
      rekeningId,
    ]);
    // Check if the rekening was found and deleted
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Rekening not found" });
    } else {
      res
        .status(200)
        .json({ id: rekeningId, message: "Rekening deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting rekening by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  addRekening,
  getAllRekening,
  getRekeningById,
  editRekeningById,
  deleteRekeningById,
};
