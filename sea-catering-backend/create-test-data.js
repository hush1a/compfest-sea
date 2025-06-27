const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Subscription = require('./models/Subscription');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sea-catering';

async function createTestData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test user
    const testUser = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      {
        fullName: 'John Doe',
        email: 'test@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'user',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Test user created:', testUser.email);

    // Create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@seacatering.com' },
      {
        fullName: 'Admin User',
        email: 'admin@seacatering.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'admin',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Admin user created:', adminUser.email);

    // Clear existing subscriptions for test user
    await Subscription.deleteMany({ userId: testUser._id });

    // Create additional test users for more realistic data
    const testUsers = [];
    for (let i = 0; i < 5; i++) {
      const user = await User.findOneAndUpdate(
        { email: `user${i + 1}@example.com` },
        {
          fullName: `Test User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          role: 'user',
          isActive: true
        },
        { upsert: true, new: true }
      );
      testUsers.push(user);
    }

    console.log(`Created ${testUsers.length} additional test users`);

    // Create test subscriptions
    const subscriptions = [
      {
        userId: testUser._id,
        name: testUser.fullName,
        phone: '+6281234567890',
        plan: 'diet',
        mealTypes: ['breakfast', 'lunch'],
        deliveryDays: ['monday', 'wednesday', 'friday'],
        allergies: 'No allergies',
        status: 'active'
      },
      {
        userId: testUser._id,
        name: testUser.fullName,
        phone: '+6281234567890',
        plan: 'protein',
        mealTypes: ['lunch', 'dinner'],
        deliveryDays: ['tuesday', 'thursday', 'saturday'],
        allergies: 'Nuts allergy',
        status: 'paused',
        pausePeriods: [{
          startDate: new Date('2025-06-20'),
          endDate: new Date('2025-07-05'),
          reason: 'Going on vacation',
          createdAt: new Date()
        }]
      },
      {
        userId: testUser._id,
        name: testUser.fullName,
        phone: '+6281234567890',
        plan: 'royal',
        mealTypes: ['breakfast', 'lunch', 'dinner'],
        deliveryDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        allergies: '',
        status: 'cancelled',
        cancellationDate: new Date('2025-05-15'),
        cancellationReason: 'Moving to different city'
      }
    ];

    for (const subData of subscriptions) {
      const subscription = new Subscription(subData);
      await subscription.save();
      console.log(`Created ${subData.plan} subscription (${subData.status})`);
    }

    // Create additional subscriptions for other test users with varying dates
    const plans = ['diet', 'protein', 'royal'];
    const statuses = ['active', 'paused', 'cancelled'];
    const mealOptions = [
      ['breakfast'],
      ['lunch'],
      ['dinner'],
      ['breakfast', 'lunch'],
      ['lunch', 'dinner'],
      ['breakfast', 'lunch', 'dinner']
    ];
    const dayOptions = [
      ['monday', 'wednesday', 'friday'],
      ['tuesday', 'thursday'],
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      ['saturday', 'sunday'],
      ['monday', 'wednesday', 'friday', 'sunday']
    ];

    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      const numSubscriptions = Math.floor(Math.random() * 3) + 1; // 1-3 subscriptions per user
      
      for (let j = 0; j < numSubscriptions; j++) {
        const randomDaysAgo = Math.floor(Math.random() * 60); // 0-60 days ago
        const createdDate = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
        
        const subscriptionData = {
          userId: user._id,
          name: user.fullName,
          phone: `+628123456789${i}`,
          plan: plans[Math.floor(Math.random() * plans.length)],
          mealTypes: mealOptions[Math.floor(Math.random() * mealOptions.length)],
          deliveryDays: dayOptions[Math.floor(Math.random() * dayOptions.length)],
          allergies: Math.random() > 0.7 ? 'No special allergies' : '',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: createdDate,
          startDate: createdDate
        };

        // Add cancellation data if cancelled
        if (subscriptionData.status === 'cancelled') {
          subscriptionData.cancellationDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
          subscriptionData.cancellationReason = 'Test cancellation';
        }

        // Add pause data if paused
        if (subscriptionData.status === 'paused') {
          const pauseStart = new Date(createdDate.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000);
          const pauseEnd = new Date(pauseStart.getTime() + (Math.random() * 14 + 7) * 24 * 60 * 60 * 1000);
          subscriptionData.pausePeriods = [{
            startDate: pauseStart,
            endDate: pauseEnd,
            reason: 'Test pause',
            createdAt: pauseStart
          }];
        }

        const subscription = new Subscription(subscriptionData);
        await subscription.save();
      }
    }

    console.log('Created additional subscriptions for test users');

    console.log('Test data created successfully!');
    console.log('\nTest user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password');
    console.log('\nAdmin user credentials:');
    console.log('Email: admin@seacatering.com');
    console.log('Password: password');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestData();
