// Mock data replacing the AI integration

const MOCK_CITIES = [
  { id: 1, name: 'Paris', country: 'France', rating: 4.8, costIndex: '$$$', image: 'https://images.unsplash.com/photo-1502602861271-e970a25df600' },
  { id: 2, name: 'Kyoto', country: 'Japan', rating: 4.9, costIndex: '$$', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { id: 3, name: 'Rome', country: 'Italy', rating: 4.7, costIndex: '$$$', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
  { id: 4, name: 'Bali', country: 'Indonesia', rating: 4.6, costIndex: '$', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { id: 5, name: 'New York City', country: 'USA', rating: 4.8, costIndex: '$$$$', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
  { id: 6, name: 'Cape Town', country: 'South Africa', rating: 4.7, costIndex: '$$', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99' }
];

const MOCK_ACTIVITIES = [
  { id: 1, title: 'Historic City Tour', description: 'Explore the main landmarks and hidden gems.', duration: 180, cost: 45, type: 'Sightseeing', rating: 4.7 },
  { id: 2, title: 'Local Food Tasting', description: 'Taste authentic dishes at the best local spots.', duration: 120, cost: 65, type: 'Food', rating: 4.9 },
  { id: 3, title: 'Mountain Hiking Trail', description: 'Enjoy breathtaking views on this guided hike.', duration: 240, cost: 30, type: 'Adventure', rating: 4.8 },
  { id: 4, title: 'Museum & Art Gallery', description: 'Discover incredible art and historical artifacts.', duration: 150, cost: 25, type: 'Culture', rating: 4.6 },
  { id: 5, title: 'Sunset Boat Cruise', description: 'Relax on the water as the sun goes down.', duration: 120, cost: 80, type: 'Relaxation', rating: 4.9 }
];

export const geminiService = {
  /**
   * Return mock cities based on a query
   */
  async searchCities(query) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return all mock cities or filter if query matches
    if (!query) return MOCK_CITIES;
    
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_CITIES.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.country.toLowerCase().includes(lowerQuery)
    );
    
    return filtered.length > 0 ? filtered : MOCK_CITIES;
  },

  /**
   * Return mock activities based on a city and type
   */
  async searchActivities(city, type) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Customize type for the mock data if it exists
    return MOCK_ACTIVITIES.map((act, index) => ({
      ...act,
      title: `${type !== 'All' ? type : 'Amazing'} Activity ${index + 1} in ${city}`,
      type: type !== 'All' ? type : act.type
    }));
  }
};
