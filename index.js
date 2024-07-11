// index.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db.js';
import authRoutes from './routes/authRoutes.js';
import donasiRoutes from './routes/donasiRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// memastikan index login tidak berulang agar tidak terjadi Dos
const cleanDuplicateIndexes = async (tableName, columnName) => {
  const queryInterface = db.getQueryInterface();
  const indexes = await queryInterface.showIndex(tableName);

  const duplicateIndexes = indexes.filter(index => index.name.startsWith(columnName));
  if (duplicateIndexes.length > 1) {
    for (let i = 1; i < duplicateIndexes.length; i++) {
      await queryInterface.removeIndex(tableName, duplicateIndexes[i].name);
    }
  }
};

// informasi koneksi database
db.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sync({ alter: true });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

//   route login dan donasi
app.use('/api/auth', authRoutes);
app.use('/api/donasi', donasiRoutes);

// informasi port yang berjalan
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
