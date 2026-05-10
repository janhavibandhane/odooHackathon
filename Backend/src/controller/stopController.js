import Stop from '../model/Stop.js';
import Trip from '../model/Trip.js';

// @desc    Add a stop to a trip
// @route   POST /api/trips/:tripId/stops
// @access  Private
export const addStop = async (req, res, next) => {
  try {
    const { city, country, arrivalDate, departureDate, order } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to add stops to this trip');
    }

    const stop = await Stop.create({
      tripId,
      city,
      country,
      arrivalDate,
      departureDate,
      order: order || 0,
    });

    res.status(201).json(stop);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stops for a trip
// @route   GET /api/trips/:tripId/stops
// @access  Private
export const getStops = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    // Check if trip exists and user is authorized (omitted for brevity, assume middleware could handle or do it here)
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString() && !trip.isPublic) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const stops = await Stop.find({ tripId }).sort({ order: 1, arrivalDate: 1 });
    res.json(stops);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a stop
// @route   DELETE /api/stops/:id
// @access  Private
export const deleteStop = async (req, res, next) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      res.status(404);
      throw new Error('Stop not found');
    }

    // Verify trip ownership
    const trip = await Trip.findById(stop.tripId);
    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await stop.deleteOne();
    res.json({ message: 'Stop removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a stop
// @route   PUT /api/trips/:tripId/stops/:id
// @access  Private
export const updateStop = async (req, res, next) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      res.status(404);
      throw new Error('Stop not found');
    }

    // Verify trip ownership
    const trip = await Trip.findById(stop.tripId);
    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const updatedStop = await Stop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedStop);
  } catch (error) {
    next(error);
  }
};
