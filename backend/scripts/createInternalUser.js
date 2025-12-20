const { User, Contact } = require('../models');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const createInternalUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = 'admin@wearcart.com';
        const password = 'admin123';
        const name = 'Admin User';

        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log('User found, updating role to internal...');
            user.role = 'internal';
            user.password = password; // Reset password to ensure access
            await user.save();
        } else {
            console.log('User not found, creating new internal user...');
            user = await User.create({
                name,
                email,
                password,
                role: 'internal',
                mobile: '0000000000'
            });
        }

        // Ensure contact exists
        let contact = await Contact.findOne({ where: { email } });
        if (!contact) {
            console.log('Creating contact for admin...');
            await Contact.create({
                name,
                email,
                type: 'both', // Admin can be both vendor and customer context conceptually
                mobile: '0000000000'
            });
        }

        console.log('Internal user ready.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating internal user:', error);
        process.exit(1);
    }
};

createInternalUser();
