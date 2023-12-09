# API Documentation

#*rest api end poin :* https://backend-moneo-pyy3zhb4pa-et.a.run.app/

#**Link documentasi** : https://www.figma.com/file/2BW6uOb9D2ZP5rdx56Icgv/Job-Desk-CC?type=whiteboard&node-id=0-1&t=glSWbT4XGb4JNk7Z-0
## Rekening Endpoints

### Add Rekening

- **Method**: `POST`
- **Path**: `/:id_account/rekening`
- **Handler**: `addRekening`

### Get All Rekening

- **Method**: `GET`
- **Path**: `/:id_account/rekening`
- **Handler**: `getAllRekening`

### Get Rekening by ID

- **Method**: `GET`
- **Path**: `/:id_account/rekening/:id`
- **Handler**: `getRekeningById`

### Edit Rekening by ID

- **Method**: `PUT`
- **Path**: `/:id_account/rekening/:id`
- **Handler**: `editRekeningById`

### Delete Rekening by ID

- **Method**: `DELETE`
- **Path**: `/:id_account/rekening/:id`
- **Handler**: `deleteRekeningById`

## Transaksi Endpoints

### Add Transaksi (Pemasukan)

- **Method**: `POST`
- **Path**: `/:id_account/transaksi/pemasukan`
- **Handler**: `addTransaksi`

### Add Transaksi (Pengeluaran)

- **Method**: `POST`
- **Path**: `/:id_account/transaksi/pengeluaran`
- **Handler**: `addTransaksi`

### Get All Transaksi

- **Method**: `GET`
- **Path**: `/:id_account/transaksi`
- **Handler**: `getAllTransaksi`

### Get Transaksi by ID

- **Method**: `GET`
- **Path**: `/:id_account/transaksi/:id`
- **Handler**: `getTransaksiById`

### Update Transaksi by ID

- **Method**: `PUT`
- **Path**: `/:id_account/transaksi/:id`
- **Handler**: `updateTransaksiById`

### Delete Transaksi by ID

- **Method**: `DELETE`
- **Path**: `/:id_account/transaksi/:id`
- **Handler**: `deleteTransaksiById`

## Laporan Endpoints

### Get All Laporan

- **Method**: `GET`
- **Path**: `/:id_account/laporan`
- **Handler**: `getAllLaporan`

### Get Detail Laporan

- **Method**: `GET`
- **Path**: `/:id_account/detaillaporan`
- **Handler**: `getDetailLaporan`
