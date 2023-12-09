const {
  addRekening,
  getAllRekening,
  getRekeningById,
  editRekeningById,
  deleteRekeningById,
} = require("./handler/rekening");

const {
  addTransaksi,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksiById,
  deleteTransaksiById,
} = require("./handler/transaksi");

const { getAlllaporan, getdetaillaporan } = require("./handler/laporan");

const router = [
  //Rekening
  {
    method: "POST",
    path: "/:id_account/rekening",
    handler: addRekening,
  },
  {
    method: "GET",
    path: "/:id_account/rekening",
    handler: getAllRekening,
  },
  {
    method: "GET",
    path: "/:id_account/rekening/:id",
    handler: getRekeningById,
  },
  {
    method: "PUT",
    path: "/:id_account/rekening/:id",
    handler: editRekeningById,
  },
  {
    method: "DELETE",
    path: "/:id_account/rekening/:id",
    handler: deleteRekeningById,
  },
  // transaksi
  {
    method: "POST",
    path: "/:id_account/transaksi/pemasukan",
    handler: addTransaksi,
  },
  {
    method: "POST",
    path: "/:id_account/transaksi/pengeluaran",
    handler: addTransaksi,
  },
  {
    method: "GET",
    path: "/:id_account/transaksi",
    handler: getAllTransaksi,
  },
  {
    method: "GET",
    path: "/:id_account/transaksi/:id",
    handler: getTransaksiById,
  },
  {
    method: "PUT",
    path: "/:id_account/transaksi/:id",
    handler: updateTransaksiById,
  },
  {
    method: "DELETE",
    path: "/:id_account/transaksi/:id",
    handler: deleteTransaksiById,
  },
  //Laporan
  {
    method: "GET",
    path: "/:id_account/laporan",
    handler: getAlllaporan,
  },
  {
    method: "GET",
    path: "/:id_account/detaillaporan",
    handler: getdetaillaporan,
  },
];

module.exports = router;
