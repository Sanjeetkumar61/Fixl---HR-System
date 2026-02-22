const Attendance = require('../models/Attendance');
const User = require('../models/User');


exports.markAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = new Attendance({
      userId: req.user._id,
      date: today,
      status: 'present',
      markedAt: new Date()
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('MarkAttendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMyAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(50);


    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;

    res.json({
      attendance,
      stats: {
        totalDays,
        presentDays,
        lateDays
      }
    });
  } catch (error) {
    console.error('GetMyAttendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.checkTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      marked: !!attendance,
      attendance: attendance || null
    });
  } catch (error) {
    console.error('CheckTodayAttendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllAttendance = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email department')
      .sort({ date: -1 })
      .limit(100);

    res.json({ attendance });
  } catch (error) {
    console.error('GetAllAttendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const presentToday = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const attendanceLast30Days = await Attendance.countDocuments({
      date: { $gte: last30Days }
    });

    res.json({
      stats: {
        totalEmployees,
        presentToday,
        attendanceLast30Days
      }
    });
  } catch (error) {
    console.error('GetAttendanceStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
