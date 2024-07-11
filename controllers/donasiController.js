import Catatan from '../models/catatan_donasi.js';
import Donasi from '../models/catatan_donasi.js';
import User from '../models/User.js';

export const addDonasi = async (req, res) => {
  const { nm_donatur, no_telp, rek_donasi, jumlah_donasi, nama_program, adminId } = req.body;

  try {
    const user = await User.findByPk(adminId);
    if (!user) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const donasi = await Catatan.create({
      nm_donatur,
      no_telp,
      rek_donasi,
      jumlah_donasi,
      nama_program,
    });

    res.status(201).json(donasi);
  } catch (err) {
    console.error('Error adding donasi:', err.message);
    res.status(500).send('Server error');
  }
};

export const getAllDonasi = async (req, res) => {
  try {
    const donasiList = await Catatan.findAll();
    res.json(donasiList);
  } catch (err) {
    console.error('Error getting donasi:', err.message);
    res.status(500).send('Server error');
  }
};

export const getDonasiById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const donasi = await Catatan.findByPk(id);
    if (!donasi) {
      return res.status(404).json({ msg: 'Donasi not found' });
    }

    res.json(donasi);
  } catch (err) {
    console.error('Error getting donasi:', err.message);
    res.status(500).send('Server error');
  }
};