const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://medi3:Danglupa89@cluster0.y9nvl.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Koneksi ke database gagal:'));
db.once('open', () => {
    console.log('Terhubung ke MongoDB Atlas');
});
