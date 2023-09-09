const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// konfigurasi
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.render('index', { 
        layout: 'layouts/main-layout',
        nama: 'Medi Rudiant', 
        title: 'Home page',
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        layout: 'layouts/main-layout',
        title: 'about page' 
    });
});


app.get('/contact', async (req, res) => {

    const contacts = await Contact.find();
    const successMessage = req.session.successMessage;
    const successDelete = req.session.successDelete;
    req.session.successMessage = undefined;
    req.session.successDelete = undefined;
    res.render('contact', { 
        layout: 'layouts/main-layout',
        title: 'contact page' ,
        contacts,
        successMessage: successMessage,
        successDelete: successDelete,
    });
});

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Detail Kontak',
    })
});

const validationPhase = [
    body('nama').custom(async value => {
        const duplikat = await Contact.findOne({ nama: value });
        if(duplikat){
            throw new Error('Nama sudah digunakan');
        };
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('noHp', 'No Hp tidak valid').isMobilePhone('id-ID'),
];

// proses data kontak
app.post('/contact', validationPhase, (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.render('add-contact', {
            layout: 'layouts/main-layout',
            title: 'Detail Kontak',
            errors: errors.array(),
        })
    } else {
        Contact.insertMany(req.body, (err, result) => {
            req.session.successMessage = 'Berhasil menambahkan kontak baru';
            res.redirect('/contact');
        });
    }
});

// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({ nama: req.params.nama });

//     if(!contact){
//         res.status(404).send('kontak tidak ditemukan')
//     } else {
//         await Contact.deleteOne({ _id: contact._id }).then((result) => {
//             req.session.successDelete = 'Kontak Berhasil dihapus! 😁';
//             res.redirect('/contact');
//         });
//     }
// });

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.session.successDelete = 'Kontak berhasil dihapus';
        res.redirect('/contact');
    })
});

app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('edit', {
        layout: 'layouts/main-layout',
        title: 'Edit Kontak',
        contact,
    });
});

const updateValidationPhase = [
    body('nama').custom( async (value, {req}) => {
        const duplikat = await Contact.findOne({nama: value});
        if(value !== req.body.oldNama && duplikat){
            throw new Error('Nama sudah digunakan')
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('noHp', 'No Hp tidak valid').isMobilePhone('id-ID'),
]

app.put('/contact', updateValidationPhase, (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('edit', {
            layout: 'layouts/main-layout',
            title: 'Edit Kontak',
            errors: errors.array(),
            contact: req.body,
        });
    } else {
        Contact.updateOne(
            { _id: req.body._id }, 
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    noHp: req.body.noHp,
                }
            }
        ).then((result) => {
            req.session.successUpdate = `Berhasil mengubah data kontak ${req.body.nama} 😊`;
            res.redirect(`/contact/${req.body.nama}`);
        })
    }
})

app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({nama: req.params.nama});
    const successUpdate = req.session.successUpdate;
    req.session.successUpdate = undefined;
    res.render('mydetail', {
        layout: 'layouts/main-layout',
        title: 'Detail Kontak',
        contact,
        successUpdate,
    })
});

app.listen(port, () => {
    console.log('mongo contact app running on ' + port)
});