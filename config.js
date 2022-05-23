const env = process.env;
const fs = require('fs')
/*
const config = {
    db:{
        host: env.DB_HOST || 'turismappitt.mysql.database.azure.com',
        port:3306,
        user: env.DB_USER || "tur_appitt2022@turismappitt",
        password: env.DB_PASSWORD || 'appITT_2022',
        database: env.DB_NAME || 'turismapp',
        ssl: {
            ca:fs.readFileSync(__dirname+'/BaltimoreCyberTrustRoot.crt.pem')
        }
    }
};
*/
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