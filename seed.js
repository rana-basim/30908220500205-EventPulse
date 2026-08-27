const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const user = require('./models/user');
const category = require('./models/category');
const event = require('./models/event');

const seeddatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to database for seeding...');

    // 1. Seed Admin User
    const existingadmin = await user.findOne({ email: 'admin@eventpulse.com' });
    let adminuser = existingadmin;

    if (!existingadmin) {
      const hashedpassword = await bcrypt.hash('admin123', 10);
      adminuser = await user.create({
        name: 'system admin',
        email: 'admin@eventpulse.com',
        password: hashedpassword,
        role: 'admin',
      });
      console.log('admin user created');
    } else {
      console.log('admin user already exists');
    }

    // 2. Seed Categories
    const samplecategories = [
      { name: 'tech', description: 'technology workshops and summits' },
      { name: 'music', description: 'live music performances and festivals' },
      { name: 'sports', description: 'tournaments and fitness events' },
    ];

    for (const cat of samplecategories) {
      await category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true }
      );
    }
    console.log('categories seeded');

    const techcategory = await category.findOne({ name: 'tech' });

    // 3. Seed Sample Event
    const sampleevent = {
      title: 'egypt tech summit 2026',
      description: 'annual backend software engineering conference',
      date: new Date('2026-11-15'),
      city: 'cairo',
      capacity: 100,
      category: techcategory._id,
      createdBy: adminuser._id,
    };

    await event.findOneAndUpdate(
      { title: sampleevent.title },
      sampleevent,
      { upsert: true, new: true }
    );
    console.log('sample event seeded');

    console.log('seeding completed successfully without duplication');
    process.exit(0);
  } catch (error) {
    console.error(`seeding error: ${error.message}`);
    process.exit(1);
  }
};

seeddatabase();