import api from '../api/axios';

export const geminiService = {
  /**
   * Search for cities using Backend AI Service
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchCities(query) {
    try {
      // Use the existing axios instance which handles auth tokens
      const { data } = await api.post('/ai/cities', { query });
      return data;
    } catch (error) {
      console.error('City Search Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate cities. Please try again.');
    }
  },

  /**
   * Search for activities in a specific city using Backend AI Service
   * @param {string} city 
   * @param {string} type 
   * @returns {Promise<Array>}
   */
  async searchActivities(city, type) {
    try {
      const { data } = await api.post('/ai/activities', { city, type });
      return data;
    } catch (error) {
      console.error('Activity Search Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate activities. Please try again.');
    }
  }
};
