const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Order = require('./models/orderschema');
const Product = require ('./models/productschema');
const Category = require('./models/categoryschema');
dotenv.config();



connectDB()

const seedDB = async () => {

  try {
    await connectDB();


    // Cleanup in correct order

    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Sample categories
    const categories = await Category.insertMany([
      { name: 'device', description: 'Electronic gadgets' },
      { name: 'components', description: 'Internal parts of a computer' },
      { name: 'accessories', description: 'Things you add' },
    ]);

    // Map categories for reference
    const [device, components, accessories] = categories;

    // Sample products
    const products = [
      {
        name: "tablet",
    price: 15000,
    category: device._id

    },
    {
     name: "phone",
     price: 5000,
     category: device._id
   },
   {
     name: "computer",
    price: 21000,
      category: device._id
   },
    {
     name: "GPU",
     price: 25000,
     category: components._id
   },
    {
      name: "RAM",
      price: 1000,
      category: components._id
    },
    {
     name: "mouse",
     price: 140,
     category: accessories._id
    }
     ];

    await Product.insertMany(products);

    console.log(`Seeded ${categories.length} categories and ${products.length} products`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

seedDB();

