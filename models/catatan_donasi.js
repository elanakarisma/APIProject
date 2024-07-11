// models/Ekskul.js
import { DataTypes } from 'sequelize';
import db from '../db.js';
import User from './User.js';

// menmbahkan tabel donatur
const Catatan = db.define('catatan_donasi', {
  nm_donatur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no_telp:{
    type: DataTypes.STRING,

    allowNull: false,
  },
  rek_donasi:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_donasi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama_program:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: true,
});

User.hasMany(Catatan, { foreignKey: 'adminId' });
Catatan.belongsTo(User, { foreignKey: 'adminId' });

export default Catatan;
