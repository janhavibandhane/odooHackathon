import Trip from '../model/Trip.js';

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, coverPhoto } = req.body;

    if (!title || !startDate || !endDate) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const trip = await Trip.create({
      userId: req.user._id,
      title,
      description,
      startDate,
      endDate,
      coverPhoto,
    });

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user trips
// @route   GET /api/trips
// @access  Private
export const getMyTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ startDate: 1 });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      // Ensure the user owns the trip
      if (trip.userId.toString() !== req.user._id.toString() && !trip.isPublic) {
        res.status(401);
        throw new Error('Not authorized to view this trip');
      }
      res.json(trip);
    } else {
      res.status(404);
      throw new Error('Trip not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get public trip by ID
// @route   GET /api/trips/public/:id
// @access  Public
export const getPublicTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userId', 'name avatar');

    if (trip && trip.isPublic) {
      res.json(trip);
    } else {
      res.status(404);
      throw new Error('Trip not found or is not public');
    }
  } catch (error) {
    next(error);
  }
};


// @desc    Update Trip
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this trip');
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Trip Budget
// @route   PUT /api/trips/:id/budget
// @access  Private
export const updateTripBudget = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this trip');
    }

    trip.budget = req.body.budget || trip.budget;
    const updatedTrip = await trip.save();

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Trip Packing List
// @route   PUT /api/trips/:id/packing
// @access  Private
export const updateTripPackingList = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this trip');
    }

    trip.packingList = req.body.packingList || trip.packingList;
    const updatedTrip = await trip.save();

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Trip Notes
// @route   PUT /api/trips/:id/notes
// @access  Private
export const updateTripNotes = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this trip');
    }

    trip.notes = req.body.notes || trip.notes;
    const updatedTrip = await trip.save();

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};
