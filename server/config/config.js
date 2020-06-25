const config = {
    port: 5001 || process.env.port,
    mongodbOptions: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    jwt_secrect_key: 'secrect#123',
    jwt_expiresIn: '30d',
    genId_length: 10
};

const development = {
    mongodb: 'mongodb://localhost:27017/MEANstackDB'
};

const production = {
    mongodb: 'mongodb://user:password@localhost:27017/MEANstackDB'
};

let environment = process.env.NODE_ENV || 'development';

console.log('Loaded Configs: ' + environment);

module.exports = Object.assign(config, eval(environment));