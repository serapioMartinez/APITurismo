const env = process.env;
const fs = require('fs')

const config = {
    db:{
        host: env.DB_HOST || 'localhost',
        port:3306,
        user: env.DB_USER || "root",
        password: env.DB_PASSWORD || '',
        database: env.DB_NAME || 'turismapp'
    }
};

module.exports = config;