const { sequelize, User, Contact, Product, PaymentTerm, DiscountOffer, CouponCode } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection OK');

    await sequelize.sync();

    // Create a default internal user
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'internal'
    });

    // Create a contact (customer)
    const customer = await Contact.create({
      userId: user.id,
      name: 'John Doe',
      type: 'customer',
      email: 'john.doe@example.com',
      mobile: '9999999999',
      address: { city: 'Mumbai', state: 'MH', pincode: '400001' }
    });

    // Payment term
    await PaymentTerm.create({
      name: 'Net 30',
      days: 30
    }).catch(() => {});

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
        images: []
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
        images: []
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
        images: ['/images/products/denim-jacket.jpg']
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
        images: ['/images/products/chinos.jpg']
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
        images: ['/images/products/floral-shirt.jpg']
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
        images: ['/images/products/kids-hoodie.jpg']
      },
      {
        productName: 'Linen Shorts',
        productCategory: 'men',
        productType: 'shorts',
        material: 'linen',
        colors: ['beige'],
        currentStock: 55,
        salesPrice: 549.0,
        salesTax: 18.0,
        purchasePrice: 300.0,
        purchaseTax: 12.0,
        published: true,
        images: ['/images/products/linen-shorts.jpg']
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
        images: ['/images/products/maxi-skirt.jpg']
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
        images: ['/images/products/sports-cap.jpg']
      }
    ];

    for (const p of products) {
      await Product.findOrCreate({ where: { productName: p.productName }, defaults: p });
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
