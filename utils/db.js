const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/medi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});



// // coba tambah 1 data
// const contact1 = new Contact({
//     nama: "dido",
//     noHp: '081282820923',
//     email: 'dido@medmed.com'
// });

// contact1.save().then((result) => console.log(result))