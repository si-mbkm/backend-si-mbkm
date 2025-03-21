/**
 * @swagger
 * components:
 *   schemas:
 *     BerkasPenilaian:
 *       type: object
 *       required:
 *         - NIM
 *         - nama_berkas
 *       properties:
 *         NIM:
 *           type: integer
 *           description: NIM Mahasiswa
 *         nama_berkas:
 *           type: string
 *           description: Nama file yang diunggah
 *         jenis_berkas:
 *           type: string
 *           enum: [CV, transkrip, KTP, sertifikat, dokumen_tambahan]
 *         description: Jenis berkas yang ingin diambil
 *       example:
 *         id_pendaftaran_mbkm: 1
 *         id_konversi_nilai: 1
 *         nama_berkas: "cv_mahasiswa.pdf"
 *         jenis_berkas : "CV"
 */

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  uploadFile,
  getFilesByType,
  getFilesByNIM,
  deleteFile,
}= require('../controllers/uploadController');
const { authenticateToken, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API untuk mengelola pengunggahan file
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Unggah berkas dengan jenis berkas tertentu
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File yang akan diunggah
 *               NIM:
 *                 type: integer
 *                 description: NIM Mahasiswa
 *               jenis_berkas:
 *                 type: string
 *                 enum: [CV, transkrip, KTP, sertifikat, dokumen_tambahan]
 *                 description: Jenis berkas yang akan diunggah
 *     responses:
 *       200:
 *         description: Berkas berhasil diunggah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BerkasPenilaian'
 *       400:
 *         description: Validasi gagal (file atau jenis berkas tidak valid)
 *       500:
 *         description: Terjadi kesalahan saat mengunggah berkas
 */

router.post('/upload', authenticateToken, authorize(['mahasiswa']), upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/upload/{jenis_berkas}:
 *   get:
 *     summary: Ambil data berdasarkan jenis berkas
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: jenis_berkas
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CV, transkrip, KTP, sertifikat, dokumen_tambahan]
 *         description: Jenis berkas yang ingin diambil
 *     responses:
 *       200:
 *         description: Data berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Berhasil mengambil data untuk jenis file: CV"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BerkasPenilaian'
 *       400:
 *         description: Jenis file tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Jenis file tidak valid. Harus salah satu dari: CV, transkrip, KTP, sertifikat, dokumen_tambahan"
 *       404:
 *         description: Tidak ada data untuk jenis file yang diminta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tidak ada data untuk jenis file: CV"
 *       500:
 *         description: Terjadi kesalahan saat mengambil data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan saat mengambil data untuk jenis file: CV"
 */

router.get('/upload/:jenis_berkas', getFilesByType);
 
/**
 * @swagger
 * /api/upload/NIM/{NIM}:
 *   get:
 *     summary: Ambil data berkas berdasarkan NIM
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: NIM
 *         required: true
 *         schema:
 *           type: string
 *         description: NIM mahasiswa yang ingin diambil berkas-berkasnya
 *     responses:
 *       200:
 *         description: Data berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Berhasil mengambil data untuk NIM: 211201212"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BerkasPenilaian'
 *       404:
 *         description: Tidak ada data untuk NIM yang diminta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tidak ada data untuk NIM: 211201212"
 *       500:
 *         description: Terjadi kesalahan saat mengambil data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan saat mengambil data untuk NIM: 211201212"
 */

router.get('/upload/NIM/:NIM', getFilesByNIM);

/**
 * @swagger
 * /api/upload/{id}:
 *   delete:
 *     summary: Hapus file berdasarkan ID
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berkas yang ingin dihapus
 *     responses:
 *       200:
 *         description: File berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File dengan ID 1 berhasil dihapus."
 *       404:
 *         description: File dengan ID yang diminta tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "File dengan ID 1 tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan saat menghapus file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan saat menghapus file dengan ID 1."
 */

router.delete('/upload/:id',authenticateToken, authorize(['mahasiswa']), deleteFile);

module.exports = router;
