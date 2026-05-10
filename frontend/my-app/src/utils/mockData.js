export const generateMockActivities = (cityName) => {
  const city = cityName || 'this city';
  
  return [
    {
      id: `mock-1-${Date.now()}`,
      title: `Guided City Tour of ${city}`,
      type: 'Sightseeing',
      cost: 45,
      duration: 120,
      description: `Explore the most famous landmarks and hidden gems of ${city} with a knowledgeable local guide. Perfect for first-time visitors!`,
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-2-${Date.now()}`,
      title: `Authentic ${city} Food Tasting`,
      type: 'Food',
      cost: 85,
      duration: 180,
      description: `Taste your way through the local markets and top eateries. Sample 5 distinct traditional dishes unique to ${city}.`,
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-3-${Date.now()}`,
      title: `Sunset Boat Cruise`,
      type: 'Relaxation',
      cost: 60,
      duration: 90,
      description: `Relax and take in the beautiful skyline of ${city} from the water as the sun sets. Includes a complimentary beverage.`,
      imageUrl: 'https://images.unsplash.com/photo-1460500063983-99ea801b6727?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-4-${Date.now()}`,
      title: `Off-Road Adventure near ${city}`,
      type: 'Adventure',
      cost: 120,
      duration: 240,
      description: `Get your adrenaline pumping on an ATV off-road trail just outside of ${city}. Equipment and training provided.`,
      imageUrl: 'https://images.unsplash.com/photo-1533561797500-4bad473209b5?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-5-${Date.now()}`,
      title: `Museum & Culture Pass`,
      type: 'Sightseeing',
      cost: 30,
      duration: 240,
      description: `Skip the line access to the top 3 museums in ${city}. Includes audio guides and temporary exhibition access.`,
      imageUrl: 'https://images.unsplash.com/photo-1518998053401-b26431c3241b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-6-${Date.now()}`,
      title: `Local Cooking Class`,
      type: 'Food',
      cost: 95,
      duration: 210,
      description: `Learn how to cook authentic local recipes from a renowned chef in ${city}. Enjoy your creations at the end of the class!`,
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-7-${Date.now()}`,
      title: `Public Transport Daily Pass`,
      type: 'Transport',
      cost: 15,
      duration: 1440,
      description: `Unlimited access to all buses, subways, and trams in ${city} for a full 24 hours.`,
      imageUrl: 'https://images.unsplash.com/photo-1519782520330-811c75ea9c42?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-8-${Date.now()}`,
      title: `Mountain Hike & Picnic`,
      type: 'Adventure',
      cost: 50,
      duration: 300,
      description: `A guided hike to a scenic viewpoint overlooking ${city}, followed by a gourmet picnic with local ingredients.`,
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
    }
  ];
};
