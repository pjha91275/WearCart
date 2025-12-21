const sequelize = require('../config/database');

const enableExtension = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Enable pg_trgm extension
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
        console.log('pg_trgm extension enabled successfully.');

        // Enable fuzzystrmatch if needed
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;');
        console.log('fuzzystrmatch extension enabled successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error enabling extension:', error);
        process.exit(1);
    }
};

enableExtension();
