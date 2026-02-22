const Leave = require('../models/Leave');
const User = require('../models/User');


exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);


    if (start > end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    let totalDays = 0;
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        totalDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    if (totalDays === 0) {
      return res.status(400).json({ message: 'No working days selected' });
    }


    const overlappingLeave = await Leave.findOne({
      userId: req.user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({ message: 'You have overlapping leave requests' });
    }

    const leave = new Leave({
      userId: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave
    });
  } catch (error) {
    console.error('ApplyLeave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id })
      .sort({ createdAt: -1 });


    const totalLeaves = leaves.length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;
    const totalDaysTaken = leaves
      .filter(l => l.status === 'approved')
      .reduce((sum, l) => sum + l.totalDays, 0);

    res.json({
      leaves,
      stats: {
        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        totalDaysTaken
      }
    });
  } catch (error) {
    console.error('GetMyLeaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Can only edit pending leaves' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    if (leaveType) leave.leaveType = leaveType;
    if (startDate) leave.startDate = new Date(startDate);
    if (endDate) leave.endDate = new Date(endDate);
    if (reason) leave.reason = reason;


    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    let totalDays = 0;
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        totalDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    leave.totalDays = totalDays;

    await leave.save();

    res.json({
      message: 'Leave updated successfully',
      leave
    });
  } catch (error) {
    console.error('UpdateLeave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending leaves' });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({ message: 'Leave cancelled successfully' });
  } catch (error) {
    console.error('CancelLeave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllLeaves = async (req, res) => {
  try {
    const { status, userId } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (userId) {
      query.userId = userId;
    }

    const leaves = await Leave.find(query)
      .populate('userId', 'name email department leaveBalance')
      .sort({ createdAt: -1 })
      .limit(100);


    const pendingCount = await Leave.countDocuments({ status: 'pending' });
    const approvedCount = await Leave.countDocuments({ status: 'approved' });
    const rejectedCount = await Leave.countDocuments({ status: 'rejected' });

    res.json({
      leaves,
      stats: {
        pendingCount,
        approvedCount,
        rejectedCount
      }
    });
  } catch (error) {
    console.error('GetAllLeaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const leave = await Leave.findById(req.params.id)
      .populate('userId', 'name email leaveBalance');

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }


    if (status === 'approved') {
      const user = await User.findById(leave.userId._id);
      if (user.leaveBalance < leave.totalDays) {
        return res.status(400).json({
          message: `Insufficient leave balance. Available: ${user.leaveBalance} days`
        });
      }


      user.leaveBalance -= leave.totalDays;
      await user.save();
    }

    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();

    if (status === 'rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    res.json({
      message: `Leave ${status} successfully`,
      leave
    });
  } catch (error) {
    console.error('UpdateLeaveStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getLeaveStats = async (req, res) => {
  try {
    const pendingCount = await Leave.countDocuments({ status: 'pending' });
    const approvedCount = await Leave.countDocuments({ status: 'approved' });
    const rejectedCount = await Leave.countDocuments({ status: 'rejected' });

    const approvedLeaves = await Leave.find({ status: 'approved' });
    const totalDaysApproved = approvedLeaves.reduce((sum, l) => sum + l.totalDays, 0);

    res.json({
      stats: {
        pendingCount,
        approvedCount,
        rejectedCount,
        totalDaysApproved
      }
    });
  } catch (error) {
    console.error('GetLeaveStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
