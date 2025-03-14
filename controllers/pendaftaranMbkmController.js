const PendaftaranMbkm = require('../models/pendaftaranMbkm');
const Mahasiswa = require('../models/mahasiswa');
const ProgramMbkm = require('../models/programMbkm');
const Dosbing = require('../models/dosbing');
const MatkulKnvrs = require('../models/matkulKnvrs');
const PendaftaranMatkulKnvrs = require('../models/pendaftaranmatkulknvrs'); // Model Pivot

const createPendaftaranMbkm = async (req, res) => {
  const { NIM, tanggal, id_program_mbkm, NIP_dosbing, status, matkul_knvrs } = req.body;

  try {
    // Validasi apakah mahasiswa dan program MBKM ada
    const mahasiswa = await Mahasiswa.findByPk(NIM);
    const programMbkm = await ProgramMbkm.findByPk(id_program_mbkm);
    if (!mahasiswa) return res.status(400).json({ message: 'Mahasiswa tidak ditemukan' });
    if (!programMbkm) return res.status(400).json({ message: 'Program MBKM tidak ditemukan' });

    // Validasi dosbing jika diisi
    if (NIP_dosbing) {
      const dosbing = await Dosbing.findByPk(NIP_dosbing);
      if (!dosbing) return res.status(400).json({ message: 'Dosen Pembimbing tidak ditemukan' });
    }

    // Buat data pendaftaran MBKM
    const pendaftaranMbkm = await PendaftaranMbkm.create({
      NIM,
      tanggal,
      id_program_mbkm,
      status,
      matkul_knvrs,
      NIP_dosbing: NIP_dosbing || null,
    });

    // Jika mahasiswa memilih mata kuliah konversi, simpan di tabel pivot
    if (matkul_knvrs && matkul_knvrs.length > 0) {
      const matkulEntries = matkul_knvrs.map(matkul => ({
        id_pendaftaran_mbkm: pendaftaranMbkm.id_pendaftaran_mbkm,
        id_matkul_knvrs: typeof matkul === "object" ? matkul.id_matkul_knvrs : matkul, 
      }));
    
      console.log("Data sebelum disimpan ke tabel pivot:", matkulEntries);
    
      await PendaftaranMatkulKnvrs.bulkCreate(matkulEntries)
        .then(() => console.log("Data berhasil masuk ke tabel pivot"))
        .catch(err => console.error("Gagal menyimpan ke tabel pivot:", err));
    }
    

    res.status(201).json({
      message: 'Pendaftaran MBKM berhasil dibuat',
      data: pendaftaranMbkm,
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat Pendaftaran MBKM', error: error.message });
  }
};

const getAllPendaftaranMbkm = async (req, res) => {
  try {
    const pendaftaranMbkm = await PendaftaranMbkm.findAll({
      include: [
        { model: Mahasiswa, as: 'mahasiswa' },
        { model: ProgramMbkm, as: 'program_mbkm' },
        { model: Dosbing, as: 'dosbing', required: false },
        { 
          model: MatkulKnvrs, 
          as: 'pendaftaranMbkmMatkulKnvrs', 
          through: { attributes: [] } // Hilangkan atribut dari tabel pivot
        },
      ],
    });

    res.status(200).json(pendaftaranMbkm);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data Pendaftaran MBKM', error: error.message });
  }
};

const getPendaftaranMbkmById = async (req, res) => {
  const { id } = req.params;

  try {
    const pendaftaranMbkm = await PendaftaranMbkm.findByPk(id, {
      include: [
        { model: Mahasiswa, as: 'mahasiswa' },
        { model: ProgramMbkm, as: 'program_mbkm' },
        { model: Dosbing, as: 'dosbing', required: false },
        { 
          model: MatkulKnvrs, 
          as: 'pendaftaranMbkmMatkulKnvrs', 
          through: { attributes: [] } 
        },
      ],
    });

    if (!pendaftaranMbkm) {
      return res.status(404).json({ message: 'Pendaftaran MBKM tidak ditemukan' });
    }

    res.status(200).json(pendaftaranMbkm);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil Pendaftaran MBKM', error: error.message });
  }
};

// Get PendaftaranMbkm by NIM
const getPendaftaranMbkmByNIM = async (req, res) => {
  const { NIM } = req.params;
  try {
    const pendaftaranMbkm = await PendaftaranMbkm.findAll({
      where: { NIM },
      include: [
        { model: Mahasiswa, as: 'mahasiswa' },
        { model: ProgramMbkm, as: 'program_mbkm' },
        { model: Dosbing, as: 'dosbing', required: false },
        { 
          model: MatkulKnvrs, 
          as: 'pendaftaranMbkmMatkulKnvrs', 
          through: { attributes: [] } // Menghubungkan melalui tabel pivot
        },
      ],
    });

    if (pendaftaranMbkm.length > 0) {
      res.status(200).json(pendaftaranMbkm);
    } else {
      res.status(404).json({ message: 'No Pendaftaran MBKM found for this NIM' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Pendaftaran MBKM by NIM', error: error.message });
  }
};


const updatePendaftaranMbkm = async (req, res) => {
  const { id } = req.params;
  const { NIM, tanggal, id_program_mbkm, NIP_dosbing, matkul_knvrs, status } = req.body;

  try {
    const pendaftaranMbkm = await PendaftaranMbkm.findByPk(id);
    if (!pendaftaranMbkm) {
      return res.status(404).json({ message: 'Pendaftaran MBKM tidak ditemukan' });
    }

    // Perbarui data utama
    await PendaftaranMbkm.update(
      { NIM, tanggal, id_program_mbkm, NIP_dosbing, status, matkul_knvrs },
      { where: { id_pendaftaran_mbkm: id } }
    );

    // Jika ada mata kuliah yang perlu diperbarui
    if (matkul_knvrs) {
      await PendaftaranMatkulKnvrs.destroy({ where: { id_pendaftaran_mbkm: id } });

      const matkulEntries = matkul_knvrs.map((matkulId) => ({
        id_pendaftaran_mbkm: id,
        id_matkul_knvrs: matkulId,
      }));

      await PendaftaranMatkulKnvrs.bulkCreate(matkulEntries);
    }

    res.status(200).json({ message: 'Pendaftaran MBKM berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui Pendaftaran MBKM', error: error.message });
  }
};

// Delete a PendaftaranMbkm
const deletePendaftaranMbkm = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PendaftaranMbkm.destroy({ where: { id_pendaftaran_mbkm: id } });
    if (deleted) {
      res.status(200).json({ message: 'Pendaftaran MBKM deleted successfully' });
    } else {
      res.status(404).json({ message: 'Pendaftaran MBKM not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Pendaftaran MBKM', error: error.message });
  }
};

module.exports = {
  createPendaftaranMbkm,
  getAllPendaftaranMbkm,
  getPendaftaranMbkmById,
  getPendaftaranMbkmByNIM,
  updatePendaftaranMbkm,
  deletePendaftaranMbkm,
};
