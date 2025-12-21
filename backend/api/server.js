const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('../config/database');
const { SystemSetting } = require('../models');

// Load env vars
dotenv.config();

// Import routes
const auth = require('../routes/auth');
const products = require('../routes/products');
const saleOrders = require('../routes/saleOrders');
const coupons = require('../routes/coupons');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Mount routes
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/sale-orders', saleOrders);
app.use('/api/coupons', coupons);
app.use('/api/payments', require('../routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Simple DB Check for Browser
app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('<h1>Database Connected Successfully!</h1><p>The backend is running and connected to PostgreSQL.</p>');
  } catch (error) {
    res.status(500).send(`<h1>Database Connection Failed</h1><p>${error.message}</p>`);
  }
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync database (create tables)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Initialize default settings
    const autoInvoiceSetting = await SystemSetting.findOne({ where: { key: 'automatic_invoicing' } });
    if (!autoInvoiceSetting) {
      await SystemSetting.create({ key: 'automatic_invoicing', value: 'false' });
    }

    // Create default payment term "Immediate Payment"
    const { PaymentTerm } = require('../models');
    const immediatePayment = await PaymentTerm.findOne({ where: { name: 'Immediate Payment' } });
    if (!immediatePayment) {
      await PaymentTerm.create({
        name: 'Immediate Payment',
        earlyPaymentDiscount: false,
        examplePreview: 'Payment Terms: Immediate Payment'
      });
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Only start server if run directly (not imported by Vercel)
if (require.main === module) {
  startServer();
}

module.exports = app;
