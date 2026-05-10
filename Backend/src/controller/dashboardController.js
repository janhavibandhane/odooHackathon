import User from '../model/User.js';
import Trip from '../model/Trip.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // For user dashboard
    const userTrips = await Trip.countDocuments({ userId: req.user._id });
    
    // In a real app we might fetch these differently or calculate them based on user activity
    const stats = {
      revenue: {
        value: '$45,231.89',
        trend: '+20.1%',
        isPositive: true
      },
      users: {
        value: '2,350',
        trend: '+15.2%',
        isPositive: true
      },
      tripsPlanned: {
        value: userTrips.toString(),
        trend: '',
        isPositive: true
      },
      recentActivity: [
        { id: 1, message: 'Trip updated', time: '2 minutes ago' },
      ]
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized as an admin');
    }

    const totalUsers = await User.countDocuments({});
    const totalTrips = await Trip.countDocuments({});
    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('-password');
    const recentTrips = await Trip.find({}).sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

    res.json({
      totalUsers,
      totalTrips,
      recentUsers,
      recentTrips
    });
  } catch (error) {
    next(error);
  }
};

