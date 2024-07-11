import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Galeri from '../models/galeri.js'; // Ganti model yang diimport
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Mengatur storage engine untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/galeri', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    const { galeri } = req.body; // Ubah nama atribut
    const { id: adminId } = req.user;
    const foto = req.file.filename; // Ubah nama atribut

    const newGaleri = await Galeri.create({ foto, galeri, adminId }); // Ganti nama model
    res.json(newGaleri);
  } catch (err) {
    console.error('Error creating galeri:', err.message);
    res.status(500).send('Server error');
  }
});

router.get('/galeri', async (req, res) => {
  try {
    const { adminId } = req.query; // Ambil adminId dari query string

    // Tambahkan kondisi where untuk filter berdasarkan adminId
    const galeriList = await Galeri.findAll({
      where: { adminId },
    });

    // Ubah URL foto menjadi URL lengkap dengan protokol dan host
    const updatedGaleriList = galeriList.map((galeri) => {
      const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${galeri.foto}`;
      return { ...galeri.dataValues, foto: fullImageUrl };
    });

    res.json(updatedGaleriList);
  } catch (err) {
    console.error('Error getting galeri:', err.message);
    res.status(500).send('Server error');
  }
});

// DELETE galeri by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params; // Ambil ID galeri dari parameter URL
  const { id: adminId } = req.user; // Ambil adminId dari token yang sudah diverifikasi

  try {
    // Cari galeri berdasarkan id dan adminId
    const galeri = await Galeri.findOne({
      where: {
        id,
        adminId,
      },
    });

    if (!galeri) {
      return res.status(404).json({ msg: 'Galeri not found' });
    }

    const fotoPath = path.join('public/uploads', galeri.foto);

    // Hapus galeri dari database
    await galeri.destroy();

    // Hapus file foto dari direktori lokal
    fs.unlink(fotoPath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err.message);
        return res.status(500).send('Server error');
      }

      res.json({ msg: 'Galeri and associated image deleted successfully' });
    });
  } catch (err) {
    console.error('Error deleting galeri:', err.message);
    res.status(500).send('Server error');
  }
});

// PUT update galeri by ID
router.put('/:id', verifyToken, upload.single('foto'), async (req, res) => {
  const { id } = req.params; // Ambil ID galeri dari parameter URL
  const { galeri } = req.body; // Ubah nama atribut
  const { id: adminId } = req.user; // Ambil adminId dari token yang sudah diverifikasi
  const foto = req.file ? req.file.filename : null; // Ubah nama atribut

  try {
    // Cari galeri berdasarkan id dan adminId
    const galeriData = await Galeri.findOne({
      where: {
        id,
        adminId,
      },
    });

    if (!galeriData) {
      return res.status(404).json({ msg: 'Galeri not found' });
    }

    // Hapus foto lama jika ada foto baru yang diupload
    if (foto && galeriData.foto) {
      const oldFotoPath = path.join('public/uploads', galeriData.foto);
      fs.unlink(oldFotoPath, (err) => {
        if (err) {
          console.error('Error deleting old image file:', err.message);
        }
      });
    }

    // Update galeri
    await Galeri.update(
      {
        galeri: galeri || galeriData.galeri, // Ubah nama atribut
        foto: foto || galeriData.foto, // Ubah nama atribut
      },
      { where: { id, adminId } }
    );

    res.json({ msg: 'Galeri updated successfully' });
  } catch (err) {
    console.error('Error updating galeri:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
