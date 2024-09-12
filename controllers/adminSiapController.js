const AdminSiap = require('../models/adminSiap');

// Get All Admin Siap
const getAdminSiap = async (req, res) => {
  try {
    const admins = await AdminSiap.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Admin Siap
const createAdminSiap = async (req, res) => {
  const { NIP_admin_siap, nama_admin_siap } = req.body;
  try {
    const admin = await AdminSiap.create({ NIP_admin_siap, nama_admin_siap });
    res.status(201).json({ message: 'Admin created successfully', data: admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Admin Siap
const updateAdminSiap = async (req, res) => {
  const { NIP_admin_siap } = req.params;
  const { nama_admin_siap } = req.body;
  try {
    await AdminSiap.update({ nama_admin_siap }, { where: { NIP_admin_siap } });
    res.status(200).json({ message: 'Admin updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Admin Siap
const deleteAdminSiap = async (req, res) => {
  const { NIP_admin_siap } = req.params;
  try {
    await AdminSiap.destroy({ where: { NIP_admin_siap } });
    res.status(200).json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminSiap,
  createAdminSiap,
  updateAdminSiap,
  deleteAdminSiap
};
