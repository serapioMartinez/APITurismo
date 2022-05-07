const env = process.env;
const fs = require('fs')
const config = {
    db:{
        host: env.DB_HOST || 'turismappitt.mysql.database.azure.com',
        user: env.DB_USER || "tur_appitt2022@turismappitt",
        password: env.DB_PASSWORD || 'appItt_2022',
        database: env.DB_NAME || 'turismapp',
        ssl: {
            ca:fs.readFileSync(__dirname+'/BaltimoreCyberTrustRoot.crt.pem')
        }
    }
};

module.exports = config;