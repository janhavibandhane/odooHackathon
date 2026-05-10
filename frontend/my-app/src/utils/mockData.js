export const generateMockActivities = (cityName) => {
  const city = cityName || 'this city';
  
  return [
    {
      id: `mock-1-${Date.now()}`,
      title: `Guided Heritage Tour of ${city}`,
      type: 'Sightseeing',
      cost: 1500,
      duration: 120,
      description: `Explore the rich history, famous monuments, and hidden cultural gems of ${city} with a knowledgeable local guide. Perfect for first-time visitors!`,
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-2-${Date.now()}`,
      title: `Authentic ${city} Street Food Trail`,
      type: 'Food',
      cost: 800,
      duration: 180,
      description: `Taste your way through the bustling local bazaars and top street food stalls. Sample 5 distinct traditional snacks unique to ${city}.`,
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-3-${Date.now()}`,
      title: `Sunset River/Lake Cruise`,
      type: 'Relaxation',
      cost: 1200,
      duration: 90,
      description: `Relax and take in the beautiful evening views of ${city} from the water as the sun sets. Includes complimentary evening chai and snacks.`,
      imageUrl: 'https://images.unsplash.com/photo-1460500063983-99ea801b6727?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-4-${Date.now()}`,
      title: `Off-Road Safari near ${city}`,
      type: 'Adventure',
      cost: 3500,
      duration: 240,
      description: `Get your adrenaline pumping on a jeep safari trail just outside of ${city}. Equipment and experienced driver provided.`,
      imageUrl: 'https://images.unsplash.com/photo-1533561797500-4bad473209b5?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-5-${Date.now()}`,
      title: `Museum & Palace Pass`,
      type: 'Sightseeing',
      cost: 600,
      duration: 240,
      description: `Skip the line access to the top historical palaces and museums in ${city}. Includes audio guides and temporary exhibition access.`,
      imageUrl: 'https://images.unsplash.com/photo-1518998053401-b26431c3241b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-6-${Date.now()}`,
      title: `Local Indian Cooking Class`,
      type: 'Food',
      cost: 2500,
      duration: 210,
      description: `Learn how to cook authentic Indian recipes with rich spices from a renowned chef in ${city}. Enjoy your feast at the end of the class!`,
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-7-${Date.now()}`,
      title: `City Metro/Transport Daily Pass`,
      type: 'Transport',
      cost: 250,
      duration: 1440,
      description: `Unlimited access to metro trains and local buses in ${city} for a full 24 hours.`,
      imageUrl: 'https://images.unsplash.com/photo-1519782520330-811c75ea9c42?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: `mock-8-${Date.now()}`,
      title: `Hill Viewpoint Trek & Picnic`,
      type: 'Adventure',
      cost: 900,
      duration: 300,
      description: `A guided early morning trek to a scenic viewpoint overlooking ${city}, followed by a hearty Indian breakfast.`,
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
    }
  ];
};
