// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Expiring token date
process.env.EXPIRE_TOKEN = '48h'


// TOKEN seed
process.env.SEED = process.env.SEED || 'develop-seed';

// Data Base
let urlDb;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URLDB = urlDb;

// Google Client Id
process.env.CLIENT_ID = process.env.CLIENT_ID || '983436758078-0f08d2dja9oucfupncdct9d5ql14mn7r.apps.googleusercontent.com';