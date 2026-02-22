require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leaves');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'HR System API is running successfully'
  });
});

const seedAdmin = async () => {
  try {
    if (process.env.SEED_ADMIN !== 'true') {
      console.log('Admin seeding skipped (SEED_ADMIN is not true)');
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || !process.env.ADMIN_PASSWORD) {
      console.log('Admin credentials missing in .env file');
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      const admin = new User({
        name: process.env.ADMIN_NAME || 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        department: process.env.ADMIN_DEPARTMENT || 'Administration',
        leaveBalance: process.env.ADMIN_LEAVE_BALANCE || 20
      });

      await admin.save();

      console.log('Admin user seeded successfully');
      console.log(`Admin Email: ${adminEmail}`);
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  try {
    await connectDB();
    console.log('Database connected successfully');

    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();