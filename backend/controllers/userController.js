const User = require('../models/User');


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
    res.json({ employees });
  } catch (error) {
    console.error('GetAllEmployees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { name, department } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, department },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('UpdateUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getStatsOverview = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    res.json({
      stats: {
        totalEmployees
      }
    });
  } catch (error) {
    console.error('GetStatsOverview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
