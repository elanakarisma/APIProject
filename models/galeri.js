import { DataTypes } from 'sequelize';
import db from '../db.js'; 

const Galeri = db.define('galeri', {
  foto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  galeri: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Galeri;
