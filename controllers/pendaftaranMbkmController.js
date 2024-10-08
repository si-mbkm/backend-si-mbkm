const PendaftaranMbkm = require('../models/pendaftaranMbkm');
const Mahasiswa = require('../models/mahasiswa');  // FK ke tabel mahasiswa
const DosenPembimbing = require('../models/dosbing');  // FK ke tabel dosbing
const KoorMbkm = require('../models/koorMbkm');  // FK ke tabel koor_mbkm

// Create a new PendaftaranMbkm
const createPendaftaranMbkm = async (req, res) => {
  const { id_pendaftaran_mbkm, NIM, NIP_dosbing, NIP_koor_mbkm, tanggal } = req.body;
  try {
    // Check if related records exist
    const mahasiswa = await Mahasiswa.findByPk(NIM);
    const dosbing = await DosenPembimbing.findByPk(NIP_dosbing);
    const koorMbkm = await KoorMbkm.findByPk(NIP_koor_mbkm);

    if (!mahasiswa || !dosbing || !koorMbkm) {
      return res.status(400).json({ message: 'Related Mahasiswa, Dosen Pembimbing, or Koor MBKM not found' });
    }

    const pendaftaranMbkm = await PendaftaranMbkm.create({
      id_pendaftaran_mbkm,
      NIM,
      NIP_dosbing,
      NIP_koor_mbkm,
      tanggal
    });
    res.status(201).json({ message: 'Pendaftaran MBKM created successfully', pendaftaranMbkm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all PendaftaranMbkm
const getAllPendaftaranMbkm = async (req, res) => {
  try {
    const pendaftaranMbkm = await PendaftaranMbkm.findAll();
    res.status(200).json(pendaftaranMbkm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a PendaftaranMbkm by ID
const getPendaftaranMbkmById = async (req, res) => {
  const { id } = req.params;
  try {
    const pendaftaranMbkm = await PendaftaranMbkm.findByPk(id);
    if (pendaftaranMbkm) {
      res.status(200).json(pendaftaranMbkm);
    } else {
      res.status(404).json({ message: 'Pendaftaran MBKM not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a PendaftaranMbkm
const updatePendaftaranMbkm = async (req, res) => {
  const { id } = req.params;
  const { NIM, NIP_dosbing, NIP_koor_mbkm, tanggal } = req.body;
  try {
    const [updated] = await PendaftaranMbkm.update(
      { NIM, NIP_dosbing, NIP_koor_mbkm, tanggal },
      { where: { id_pendaftaran_mbkm: id } }
    );
    if (updated) {
      const updatedPendaftaranMbkm = await PendaftaranMbkm.findByPk(id);
      res.status(200).json({ message: 'Pendaftaran MBKM updated successfully', updatedPendaftaranMbkm });
    } else {
      res.status(404).json({ message: 'Pendaftaran MBKM not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a PendaftaranMbkm
const deletePendaftaranMbkm = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PendaftaranMbkm.destroy({ where: { id_pendaftaran_mbkm: id } });
    if (deleted) {
      res.status(204).json({ message: 'Pendaftaran MBKM deleted successfully' });
    } else {
      res.status(404).json({ message: 'Pendaftaran MBKM not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPendaftaranMbkm,
  getAllPendaftaranMbkm,
  getPendaftaranMbkmById,
  updatePendaftaranMbkm,
  deletePendaftaranMbkm
};
