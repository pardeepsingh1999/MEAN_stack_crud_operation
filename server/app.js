require('./config/passportConfig');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const fileUpload = require('express-fileupload');


const config = require('./config/config');

const app = express();

app.use(fileUpload());

app.use(express.static( path.join(__dirname, 'public') ));


mongoose.connect(config.mongodb, config.mongodbOptions);
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB successfully!!!');
});

db.on('error', err => {
    console.log('MongoDb error :' + err);
});

app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(cors());

app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('work')
});

const index = require('./routes/indexRouter');

app.use('/api', index);

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`)
})