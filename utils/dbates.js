const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://medirudiantoni:Mahastry15%25@cluster0.ozxm4vq.mongodb.net/mahasiswa';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Koneksi MongoDB gagal:', error);
});

db.once('open', () => {
  console.log('Terhubung ke MongoDB');
});
