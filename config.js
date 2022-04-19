const env = process.env;

const config = {
    db:{
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER || 'root',
        password: env.DB_PASSWORD || '',
        database: env.DB_NAME || 'turismapp',
    }
};

module.exports = config;