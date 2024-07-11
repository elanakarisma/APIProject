import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import Catatan from '../models/catatan_donasi.js';

const router = express.Router();

// Create a new Catatan dan memastikan hanya user tertentu yang bisa melakukan
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nm_donatur, no_telp, rek_donasi, jumlah_donasi, nama_program } = req.body;
    const { id: adminId } = req.user;

    // Pastikan yang bisa menambahkan adalah pengguna selain admin (id selain 1)
    if (adminId === 1) {
      return res.status(403).json({ msg: 'Admin cannot add donations' });
    }

    const donasi = await Catatan.create({ nm_donatur, no_telp, rek_donasi, jumlah_donasi, nama_program, adminId });
    res.status(201).json({
      message: 'Donasi created successfully',
      donasi
    });
  } catch (err) {
    console.error('Error creating donasi:', err.message);
    res.status(500).send('server error -> periksa log error');
  }
});

// Rute untuk pengguna biasa melihat donasi mereka sendiri
router.get('/', verifyToken, async (req, res) => {
  try {
    const { id: adminId } = req.user; // Ambil adminId dari token yang sudah diverifikasi

    const donasiList = await Catatan.findAll({
      where: { adminId },
    });

    res.json(donasiList);
  } catch (err) {
    console.error('Terjadi kesalahan saat mengambil donasi:', err.message);
    res.status(500).send('server error -> periksa log error');
  }
});

// Rute khusus admin untuk melihat semua donasi
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const donasiList = await Catatan.findAll();
    res.json(donasiList);
  } catch (err) {
    console.error('Terjadi kesalahan saat mengambil donasi:', err.message);
    res.status(500).send('server error -> periksa log error');
  }
});

// Admin dapat menghapus donasi
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const donasi = await Catatan.findByPk(id);

    if (!donasi) {
      return res.status(404).json({ msg: 'donasi not found' });
    }

    await donasi.destroy();

    res.json({ msg: 'donasi deleted successfully' });
  } catch (err) {
    console.error('Error deleting donasi:', err.message);
    res.status(500).send('server error -> periksa log error');
  }
});

// Admin dapat memperbarui donasi
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nm_donatur, no_telp, rek_donasi, jumlah_donasi, nama_program } = req.body;

  try {
    const donasi = await Catatan.findByPk(id);

    if (!donasi) {
      return res.status(404).json({ msg: 'donasi not found' });
    }

    await Catatan.update(
      {
        nm_donatur: nm_donatur || donasi.nm_donatur,
        no_telp: no_telp || donasi.no_telp,
        rek_donasi: rek_donasi || donasi.rek_donasi,
        jumlah_donasi: jumlah_donasi || donasi.jumlah_donasi,
        nama_program: nama_program || donasi.nama_program,
      },
      { where: { id } }
    );

    res.json({ msg: 'donasi updated successfully' });
  } catch (err) {
    console.error('Error updating donasi:', err.message);
    res.status(500).send('server error -> periksa log error');
  }
});

export default router;
