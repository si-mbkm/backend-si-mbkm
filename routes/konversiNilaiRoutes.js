/**
 * @swagger
 * components:
 *   schemas:
 *     KonversiNilai:
 *       type: object
 *       required:
 *         - id_berkas_penilaian
 *         - nilai_akhir
 *         - grade
 *       properties:
 *         id_konversi_nilai:
 *           type: integer
 *           description: ID dari konversi nilai
 *         NIM:
 *           type: integer
 *           description: NIM mahasiswa yang terkait dengan konversi nilai
 *         id_berkas_penilaian:
 *           type: integer
 *           description: ID dari berkas penilaian yang terkait
 *         nama_berkas:
 *           type: string
 *           description: Nama berkas yang terkait dengan konversi nilai
 *         NIP_dosbing:
 *           type: string
 *           description: NIP dosen pembimbing yang terkait
 *         nilai_akhir:
 *           type: integer
 *           description: Nilai akhir dari konversi nilai
 *         grade:
 *           type: string
 *           description: Grade dari konversi nilai
 *         status:
 *           type: string
 *           description: Status konversi nilai (misalnya, "Valid" atau "Pending")
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middlewares/auth');
const {
  createKonversiNilai,
  getAllKonversiNilai,
  getKonversiNilaiById,
  updateKonversiNilai,
  deleteKonversiNilai
} = require('../controllers/konversiNilaiController');

/**
 * @swagger
 * tags:
 *   name: KonversiNilai
 *   description: API untuk mengelola data konversi nilai
 */

/**
 * @swagger
 * /api/konversi-nilai:
 *   post:
 *     summary: Menambahkan konversi nilai baru
 *     tags: [KonversiNilai]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KonversiNilai'
 *     responses:
 *       201:
 *         description: Konversi nilai berhasil ditambahkan
 */

router.post('/', authenticateToken, authorize(['dosbing', 'koor_mbkm']), createKonversiNilai);

/**
 * @swagger
 * /api/konversi-nilai:
 *   get:
 *     summary: Mengambil semua data konversi nilai
 *     tags: [KonversiNilai]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua data konversi nilai
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KonversiNilai'
 */

router.get('/', authenticateToken, authorize(['admin_siap', 'dosbing', 'koor_mbkm']), getAllKonversiNilai);

/**
 * @swagger
 * /api/konversi-nilai/{id}:
 *   get:
 *     summary: Mengambil data konversi nilai berdasarkan ID
 *     tags: [KonversiNilai]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID konversi nilai yang akan diambil
 *     responses:
 *       200:
 *         description: Berhasil mengambil data konversi nilai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KonversiNilai'
 */

router.get('/:id', authenticateToken, authorize(['admin_siap', 'dosbing', 'koor_mbkm']), getKonversiNilaiById);

/**
 * @swagger
 * /api/konversi-nilai/{id}:
 *   put:
 *     summary: Memperbarui data konversi nilai berdasarkan ID
 *     tags: [KonversiNilai]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID konversi nilai yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KonversiNilai'
 *     responses:
 *       200:
 *         description: Data konversi nilai berhasil diperbarui
 */

router.put('/:id', authenticateToken, authorize(['admin_siap', 'dosbing', 'koor_mbkm']), updateKonversiNilai);

/**
 * @swagger
 * /api/konversi-nilai/{id}:
 *   delete:
 *     summary: Menghapus konversi nilai berdasarkan ID
 *     tags: [KonversiNilai]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID konversi nilai yang akan dihapus
 *     responses:
 *       204:
 *         description: Konversi nilai berhasil dihapus
 */

router.delete('/:id', authenticateToken, authorize(['dosbing', 'koor_mbkm']), deleteKonversiNilai);

module.exports = router;
