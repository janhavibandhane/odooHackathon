import Activity from '../model/Activity.js';
import Stop from '../model/Stop.js';
import Trip from '../model/Trip.js';

// @desc    Add an activity to a stop
// @route   POST /api/stops/:stopId/activities
// @access  Private
export const addActivity = async (req, res, next) => {
  try {
    const { title, type, cost, duration, description } = req.body;
    const { stopId } = req.params;

    const stop = await Stop.findById(stopId);
    if (!stop) {
      res.status(404);
      throw new Error('Stop not found');
    }

    const trip = await Trip.findById(stop.tripId);
    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const activity = await Activity.create({
      stopId,
      title,
      type,
      cost,
      duration,
      description,
    });

    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all activities for a stop
// @route   GET /api/stops/:stopId/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const activities = await Activity.find({ stopId });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      res.status(404);
      throw new Error('Activity not found');
    }

    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (error) {
    next(error);
  }
};
