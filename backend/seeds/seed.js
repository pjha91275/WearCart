const { sequelize, User, Contact, Product, PaymentTerm, DiscountOffer, CouponCode } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection OK');

    await sequelize.sync();

    // Create a default internal user
    const [user] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: 'internal'
      }
    });

    // Create a contact (customer)
    const [customer] = await Contact.findOrCreate({
      where: { email: 'john.doe@example.com' },
      defaults: {
        userId: user.id,
        name: 'John Doe',
        type: 'customer',
        email: 'john.doe@example.com',
        mobile: '9999999999',
        address: { city: 'Mumbai', state: 'MH', pincode: '400001' }
      }
    });

    // Payment term
    await PaymentTerm.create({
      name: 'Net 30',
      days: 30
    }).catch(() => { });

    // Create some products
    const products = [
      {
        productName: 'Classic Tee',
        productCategory: 'men',
        productType: 't-shirt',
        material: 'cotton',
        colors: ['white', 'black'],
        currentStock: 100,
        salesPrice: 499.0,
        salesTax: 18.0,
        purchasePrice: 250.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Summer Dress',
        productCategory: 'women',
        productType: 'dress',
        material: 'linen',
        colors: ['blue'],
        currentStock: 50,
        salesPrice: 1299.0,
        salesTax: 18.0,
        purchasePrice: 700.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Denim Jacket',
        productCategory: 'unisex',
        productType: 'jacket',
        material: 'denim',
        colors: ['blue'],
        currentStock: 40,
        salesPrice: 2499.0,
        salesTax: 18.0,
        purchasePrice: 1400.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1523205565295-f8e91625443b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Chinos',
        productCategory: 'men',
        productType: 'pants',
        material: 'cotton',
        colors: ['khaki', 'navy'],
        currentStock: 80,
        salesPrice: 899.0,
        salesTax: 18.0,
        purchasePrice: 450.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Floral Shirt',
        productCategory: 'women',
        productType: 'shirt',
        material: 'viscose',
        colors: ['multi'],
        currentStock: 60,
        salesPrice: 749.0,
        salesTax: 18.0,
        purchasePrice: 380.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1764337593519-c51a77b4fc3d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZsb3JhbCUyMHNoaXJ0fGVufDB8fDB8fHww']
      },
      {
        productName: 'Kids Hoodie',
        productCategory: 'children',
        productType: 'hoodie',
        material: 'fleece',
        colors: ['red'],
        currentStock: 70,
        salesPrice: 599.0,
        salesTax: 18.0,
        purchasePrice: 320.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Linen Shorts',
        productCategory: 'women',
        productType: 'shorts',
        material: 'linen',
        colors: ['beige'],
        currentStock: 55,
        salesPrice: 549.0,
        salesTax: 18.0,
        purchasePrice: 300.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Maxi Skirt',
        productCategory: 'women',
        productType: 'skirt',
        material: 'cotton',
        colors: ['black'],
        currentStock: 45,
        salesPrice: 999.0,
        salesTax: 18.0,
        purchasePrice: 520.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Sports Cap',
        productCategory: 'unisex',
        productType: 'cap',
        material: 'polyester',
        colors: ['black'],
        currentStock: 150,
        salesPrice: 199.0,
        salesTax: 18.0,
        purchasePrice: 90.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Slim Fit Jeans',
        productCategory: 'men',
        productType: 'jeans',
        material: 'denim',
        colors: ['blue'],
        currentStock: 30,
        salesPrice: 1999.0,
        salesTax: 18.0,
        purchasePrice: 900.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
      },
      {
        productName: 'Professional Suit',
        productCategory: 'men',
        productType: 'suit',
        material: 'wool',
        colors: ['grey'],
        currentStock: 15,
        salesPrice: 8999.0,
        salesTax: 18.0,
        purchasePrice: 4000.0,
        purchaseTax: 12.0,
        published: true,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
      }
    ];

    for (const p of products) {
      const [product, created] = await Product.findOrCreate({ where: { productName: p.productName }, defaults: p });
      if (!created) {
        // If product exists, update it to ensure we have the correct images
        await product.update(p);
      }
    }

    // Discount offer + coupon
    const today = new Date();
    const later = new Date();
    later.setDate(today.getDate() + 30);

    const [offer] = await DiscountOffer.findOrCreate({
      where: { name: 'Holiday Sale' },
      defaults: {
        name: 'Holiday Sale',
        discountPercentage: 15.0,
        startDate: today,
        endDate: later,
        availableOn: 'website'
      }
    });

    await CouponCode.findOrCreate({
      where: { code: 'HOLIDAY15' },
      defaults: {
        discountOfferId: offer.id,
        code: 'HOLIDAY15',
        expirationDate: later,
        status: 'unused',
        contactId: customer.id
      }
    });

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
