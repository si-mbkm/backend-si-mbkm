/**
 * @swagger
 * components:
 *   schemas:
 *     Mahasiswa:
 *       type: object
 *       required:
 *         - NIM
 *         - nama_mahasiswa
 *         - semester
 *         - id_program_mbkm
 *         - NIP_dosbing
 *       properties:
 *         NIM:
 *           type: integer
 *           description: Nomor Induk Mahasiswa
 *         nama_mahasiswa:
 *           type: string
 *           description: Nama lengkap Mahasiswa
 *         semester:
 *           type: integer
 *           description: Semester Mahasiswa saat ini
 *         id_program_mbkm:
 *           type: integer
 *           description: ID program MBKM yang diikuti Mahasiswa
 *         NIP_dosbing:
 *           type: integer
 *           description: NIP Dosen Pembimbing
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middlewares/auth');
const {
  createMahasiswa,
  getAllMahasiswa,
  getMahasiswaByNIM,
  updateMahasiswa,
  deleteMahasiswa
} = require('../controllers/mahasiswaController');

/**
 * @swagger
 * tags:
 *   name: Mahasiswa
 *   description: API untuk mengelola data Mahasiswa
 */

/**
 * @swagger
 * /api/mahasiswa:
 *   post:
 *     summary: Menambahkan data Mahasiswa baru
 *     tags: [Mahasiswa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mahasiswa'
 *     responses:
 *       201:
 *         description: Data Mahasiswa berhasil ditambahkan
 */
router.post('/', authenticateToken, authorize(['koor_mbkm']), createMahasiswa);

/**
 * @swagger
 * /api/mahasiswa:
 *   get:
 *     summary: Mengambil semua data Mahasiswa
 *     tags: [Mahasiswa]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Mahasiswa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mahasiswa'
 */
router.get('/', getAllMahasiswa);

/**
 * @swagger
 * /api/mahasiswa/{NIM}:
 *   get:
 *     summary: Mengambil data Mahasiswa berdasarkan NIM
 *     tags: [Mahasiswa]
 *     parameters:
 *       - in: path
 *         name: NIM
 *         required: true
 *         schema:
 *           type: integer
 *         description: NIM Mahasiswa yang akan diambil
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Mahasiswa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mahasiswa'
 */
router.get('/:NIM', getMahasiswaByNIM);

/**
 * @swagger
 * /api/mahasiswa/{NIM}:
 *   put:
 *     summary: Memperbarui data Mahasiswa berdasarkan NIM
 *     tags: [Mahasiswa]
 *     parameters:
 *       - in: path
 *         name: NIM
 *         required: true
 *         schema:
 *           type: integer
 *         description: NIM Mahasiswa yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mahasiswa'
 *     responses:
 *       200:
 *         description: Data Mahasiswa berhasil diperbarui
 */
router.put('/:NIM', authenticateToken, authorize(['koor_mbkm']), updateMahasiswa);

/**
 * @swagger
 * /api/mahasiswa/{NIM}:
 *   delete:
 *     summary: Menghapus data Mahasiswa berdasarkan NIM
 *     tags: [Mahasiswa]
 *     parameters:
 *       - in: path
 *         name: NIM
 *         required: true
 *         schema:
 *           type: integer
 *         description: NIM Mahasiswa yang akan dihapus
 *     responses:
 *       204:
 *         description: Data Mahasiswa berhasil dihapus
 */
router.delete('/:NIM', authenticateToken, authorize(['koor_mbkm']), deleteMahasiswa);

module.exports = router;
