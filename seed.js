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
      adminuser = await user.create({
        name: 'system admin',
        email: 'admin@eventpulse.com',
        password: 'admin123',
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
    const musiccategory = await category.findOne({ name: 'music' });
    const sportscategory = await category.findOne({ name: 'sports' });

    // 3. Seed Sample Event
    const sampleevent = {
      title: 'egypt tech summit 2026',
      description: 'annual backend software engineering conference',
      date: new Date('2026-11-15'),
      city: 'cairo',
      capacity: 100,
      category: techcategory._id,
      createdby: adminuser._id,
    };

    const sampleevent2 = {
       title: "downtown cairo jazz night",
       description: "live outdoor music festival featuring local jazz bands.",
       date: new Date("2026-10-05"),
       city: 'cairo',
       capacity: 300,
       category: musiccategory?._id,
       createdby: adminuser?._id
    };
    //  Capacity is 0 to test what happens in a full registration
    const sampleevent3 = {
      title: "national tennis championship",
      description: "tournament with prizes.",
      date: new Date("2026-11-05"),
      capacity: 0,
      city: "alexandria",
      category: sportscategory?._id,
      createdby: adminuser?._id
    }

    const sampleevent4 = {
      title: "banha marathon",
      description: "10km fitness event",
      date: new Date("2026-12-03"),
      capacity: 50,
      city: "banha",
      category: sportscategory?._id,
      createdby: adminuser?._id
    }

    await event.findOneAndUpdate(
      { title: sampleevent.title },
      sampleevent,
      { upsert: true, new: true }
    );
    console.log('sample event seeded');

    await event.findOneAndUpdate(
      { title: sampleevent2.title },
      sampleevent2,
      { upsert: true, new: true }
    );
    console.log('sample event 2 seeded');

    await event.findOneAndUpdate(
      { title: sampleevent3.title },
      sampleevent3,
      { upsert: true, new: true }
    );
    console.log('sample event 3 seeded');

    await event.findOneAndUpdate(
      { title: sampleevent4.title },
      sampleevent4,
      { upsert: true, new: true }
    );
    console.log('sample event 4 seeded');

    console.log('seeding completed successfully without duplication');
    process.exit(0);
  } catch (error) {
    console.error(`seeding error: ${error.message}`);
    process.exit(1);
  }
};

seeddatabase();