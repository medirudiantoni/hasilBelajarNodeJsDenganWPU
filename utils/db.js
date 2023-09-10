const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://medi3:Danglupa89@cluster0.y9nvl.mongodb.net/?retryWrites=true&w=majority', {
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