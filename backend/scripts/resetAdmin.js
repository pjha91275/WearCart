const { User, Contact } = require('../models');
const sequelize = require('../config/database');

const resetAdminUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = 'admin@wearcart.com';
        const password = 'admin123';
        const name = 'Admin User';

        // 1. Delete existing user and derived contacts if possible
        console.log('Cleaning up existing admin user...');
        await User.destroy({ where: { email } });
        await Contact.destroy({ where: { email } });

        // 2. Create Fresh User
        console.log('Creating new admin user...');
        // Note: Hooks in User.js should handle password hashing automatically
        const user = await User.create({
            name,
            email,
            password: password, // Logic in User model beforeCreate hook will hash this
            role: 'internal',
            mobile: '0000000000',
            address: { city: 'Admin City', state: 'Admin State', pincode: '000000' }
        });

        // 3. Create Contact
        console.log('Creating contact for admin...');
        await Contact.create({
            userId: user.id,
            name,
            email,
            type: 'both',
            mobile: '0000000000',
            address: { city: 'Admin City', state: 'Admin State', pincode: '000000' }
        });

        console.log('Admin user reset successfully.');
        console.log(`Email: ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin user:', error);
        process.exit(1);
    }
};

resetAdminUser();
