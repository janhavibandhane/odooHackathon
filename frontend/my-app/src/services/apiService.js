import api from '../api/axios';

export const tripService = {
  createTrip: async (tripData) => {
    const { data } = await api.post('/trips', tripData);
    return data;
  },
  getMyTrips: async () => {
    const { data } = await api.get('/trips');
    return data;
  },
  getTripById: async (id) => {
    const { data } = await api.get(`/trips/${id}`);
    return data;
  },
  getPublicTrip: async (id) => {
    const { data } = await api.get(`/trips/public/${id}`);
    return data;
  },
  updateTrip: async (id, tripData) => {
    const { data } = await api.put(`/trips/${id}`, tripData);
    return data;
  },
  updateBudget: async (id, budgetData) => {
    const { data } = await api.put(`/trips/${id}/budget`, budgetData);
    return data;
  },
  updatePackingList: async (id, packingData) => {
    const { data } = await api.put(`/trips/${id}/packing`, packingData);
    return data;
  },
  updateNotes: async (id, notesData) => {
    const { data } = await api.put(`/trips/${id}/notes`, notesData);
    return data;
  },
};

export const stopService = {
  getStopsForTrip: async (tripId) => {
    const { data } = await api.get(`/trips/${tripId}/stops`);
    return data;
  },
  createStop: async (tripId, stopData) => {
    const { data } = await api.post(`/trips/${tripId}/stops`, stopData);
    return data;
  },
  updateStop: async (tripId, stopId, stopData) => {
    const { data } = await api.put(`/trips/${tripId}/stops/${stopId}`, stopData);
    return data;
  },
  deleteStop: async (tripId, stopId) => {
    const { data } = await api.delete(`/trips/${tripId}/stops/${stopId}`);
    return data;
  },
};

export const activityService = {
  getActivitiesForStop: async (stopId) => {
    const { data } = await api.get(`/stops/${stopId}/activities`);
    return data;
  },
  createActivity: async (stopId, activityData) => {
    const { data } = await api.post(`/stops/${stopId}/activities`, activityData);
    return data;
  },
  updateActivity: async (activityId, activityData) => {
    const { data } = await api.put(`/activities/${activityId}`, activityData);
    return data;
  },
  deleteActivity: async (activityId) => {
    const { data } = await api.delete(`/activities/${activityId}`);
    return data;
  },
};

export const authService = {
  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },
};

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/dashboard/admin/stats');
    return data;
  },
};
