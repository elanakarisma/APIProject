import galeri from '../models/galeri.js'; // Ubah import model
import User from '../models/User.js';

export const addgaleri = async (req, res) => { // Ubah nama fungsi
  const { galeri, adminId } = req.body; // Ubah nama atribut
  const foto = req.file.filename; // Ubah nama atribut

  try {
    const user = await User.findByPk(adminId);
    if (!user) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const newgaleri = await galeri.create({
      foto, // Ubah nama atribut
      adminId,
    });

    res.status(201).json(newgaleri);
  } catch (err) {
    console.error('Error adding galeri:', err.message);
    res.status(500).send('Server error');
  }
};

export const getAllgaleri = async (req, res) => { // Ubah nama fungsi
  try {
    const galeriList = await galeri.findAll(); // Ubah nama model
    res.json(galeriList);
  } catch (err) {
    console.error('Error getting galeri:', err.message);
    res.status(500).send('Server error');
  }
};

export const getgaleriById = async (req, res) => { // Ubah nama fungsi
  const { id } = req.params;
  
  try {
    const galeri = await galeri.findByPk(id); // Ubah nama model
    if (!galeri) {
      return res.status(404).json({ msg: 'galeri not found' });
    }

    res.json(galeri);
  } catch (err) {
    console.error('Error getting galeri:', err.message);
    res.status(500).send('Server error');
  }
};
