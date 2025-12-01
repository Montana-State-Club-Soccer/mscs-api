const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing users (optional - comment out if you want to keep existing users)
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Create admin user
        const admin = new User({
            email: 'admin@mscs.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin user created');
        console.log('   Email: admin@mscs.com');
        console.log('   Password: admin123');

        // Create player user
        const player = new User({
            email: 'player@mscs.com',
            password: 'player123',
            name: 'Player User',
            role: 'user'
        });
        await player.save();
        console.log('✅ Player user created');
        console.log('   Email: player@mscs.com');
        console.log('   Password: player123');

        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📝 Test Accounts:');
        console.log('   Admin:  admin@mscs.com  / admin123');
        console.log('   Player: player@mscs.com / player123');
        console.log('   Guest:  No login required (read-only access)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedUsers();
