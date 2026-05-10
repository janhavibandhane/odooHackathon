import Trip from '../model/Trip.js';
import Stop from '../model/Stop.js';
import Activity from '../model/Activity.js';

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
    console.log(`Fetching public trip: ${req.params.id}`);
    const trip = await Trip.findById(req.params.id).populate('userId', 'name avatar');
    
    if (trip) {
      console.log(`Trip found: ${trip.title}, isPublic: ${trip.isPublic}`);
    } else {
      console.log(`Trip not found: ${req.params.id}`);
    }

    if (trip && trip.isPublic) {
      // Fetch stops
      const stops = await Stop.find({ tripId: trip._id }).sort({ order: 1 });
      
      // Fetch activities for each stop
      const stopsWithActivities = await Promise.all(stops.map(async (stop) => {
        const activities = await Activity.find({ stopId: stop._id });
        return { ...stop.toObject(), activities };
      }));

      const tripObject = trip.toObject();
      tripObject.stops = stopsWithActivities;

      res.json(tripObject);
    } else {
      res.status(404);
      throw new Error('Trip not found or is not public');
    }
  } catch (error) {
    next(error);
  }
};


// @desc    Make trip public/shareable
// @route   PUT /api/trips/:id/share
// @access  Private
export const shareTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to share this trip');
    }

    trip.isPublic = true;
    await trip.save();

    res.json({
      message: 'Trip is now public',
      isPublic: true,
    });
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

// @desc    Delete Trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error('Trip not found');
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this trip');
    }

    await trip.deleteOne();
    res.json({ message: 'Trip removed' });
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
    trip.notes = req.body.notes || trip.notes;
    const updatedTrip = await trip.save();

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

// @desc    Clone/Copy a trip
// @route   POST /api/trips/:id/clone
// @access  Private
export const cloneTrip = async (req, res, next) => {
  try {
    const originalTrip = await Trip.findById(req.params.id);

    if (!originalTrip) {
      res.status(404);
      throw new Error('Original trip not found');
    }

    // 1. Create the new trip
    const clonedTrip = await Trip.create({
      userId: req.user._id,
      title: `${originalTrip.title} (Cloned)`,
      description: originalTrip.description,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      coverPhoto: originalTrip.coverPhoto,
      isPublic: false,
      budget: originalTrip.budget,
      packingList: originalTrip.packingList,
      notes: originalTrip.notes,
    });

    // 2. Clone stops
    const originalStops = await Stop.find({ tripId: originalTrip._id }).sort({ order: 1 });
    
    for (const stop of originalStops) {
      const clonedStop = await Stop.create({
        tripId: clonedTrip._id,
        city: stop.city,
        country: stop.country,
        arrivalDate: stop.arrivalDate,
        departureDate: stop.departureDate,
        order: stop.order,
      });

      // 3. Clone activities for this stop
      const originalActivities = await Activity.find({ stopId: stop._id });
      for (const activity of originalActivities) {
        await Activity.create({
          stopId: clonedStop._id,
          title: activity.title,
          type: activity.type,
          cost: activity.cost,
          duration: activity.duration,
          description: activity.description,
        });
      }
    }

    res.status(201).json(clonedTrip);
  } catch (error) {
    next(error);
  }
};
