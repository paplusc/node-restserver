// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Expiring token date
// 60 sec
// 60 min
// 24 hours
// 30 days
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30


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