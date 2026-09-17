# WearCart - Apparel E-commerce & Business Management System

# Demo Vieo - https://drive.google.com/file/d/1-MVuq8ZhpDC80TfP3JyuczfGQuAT1r13/view?usp=sharing

A modern full-stack apparel e-commerce and business management platform that enables customers to shop online while providing administrators with inventory, order, invoice, payment, and purchase management capabilities.

## Features

### Customer Portal (Frontend)
- Browse products with filters (category, type, search)
- Add items to cart
- Apply coupon codes during checkout
- Make payments
- View and download sale orders and invoices

### Internal Users (Backend Admin)
- Manage products (create, edit, stock, publish/unpublish)
- Manage contacts/users
- Create and manage sale orders, purchase orders
- Generate customer invoices and vendor bills
- Record payments
- Set up payment terms and discount offers (coupon codes)
- View sales and purchase reports

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT

✨ Key Highlights

- Customer shopping portal
- Inventory management
- Sales & purchase order management
- Customer invoices & vendor bills
- Payment tracking
- Coupon & discount management
- PostgreSQL relational database
- JWT authentication
- Role-based administration

## Project Structure

```
WearCart/
├── backend/          # Express.js API
│   ├── config/       # Database configuration
│   ├── controllers/ # Route controllers
│   ├── models/      # Sequelize models
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── server.js    # Entry point
├── frontend/        # Next.js application
│   ├── app/         # Next.js app directory
│   ├── components/ # React components
│   └── store/       # State management
└── public/          # Static assets (logo, favicon)
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wearcart
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

5. Create PostgreSQL database:
```sql
CREATE DATABASE wearcart;
```

6. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Database Models

- **Users**: System users (internal and portal)
- **Contacts**: Business contacts (customers/vendors)
- **Products**: Clothing items with stock management
- **Payment Terms**: Payment conditions with early payment discounts
- **Discount Offers**: Discount programs
- **Coupon Codes**: Individual coupon codes linked to discount offers
- **Sale Orders**: Customer orders from website/backend
- **Purchase Orders**: Vendor purchase orders
- **Customer Invoices**: Invoices generated from sale orders
- **Vendor Bills**: Bills from purchase orders
- **Payments**: Payment records

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (internal only)
- `PUT /api/products/:id` - Update product (internal only)
- `DELETE /api/products/:id` - Delete product (internal only)

### Sale Orders
- `POST /api/sale-orders` - Create sale order
- `GET /api/sale-orders` - Get all sale orders
- `GET /api/sale-orders/:id` - Get single sale order
- `POST /api/sale-orders/:id/invoice` - Create invoice from order

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/coupons` - Get all coupons (internal only)

## Features Implementation

### Automatic Stock Management
- Stock is automatically updated when purchase orders are confirmed
- Stock is automatically reduced when sale orders are confirmed

### Automatic Invoicing
- System setting controls automatic invoice generation
- When enabled, invoices are automatically created after website payment
- When disabled, invoices must be manually created in backend

### Payment Terms
- Support for early payment discounts
- Configurable discount percentage and days
- Discount can be applied on base amount or total amount

### Coupon Codes
- Contact-based restrictions
- Expiration date validation
- Linked to discount offers with date ranges
- Available on sales or website

## Team 

This project was built and developed as a team project by:
- **Prince Jha**
- **Sachin Jha**
- **Ishaan Dubey**

## License

ISC
