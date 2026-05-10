import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client using the server environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const searchCities = async (req, res, next) => {
  try {
    const { query } = req.body;
    console.log(process.env.GEMINI_API_KEY);

    if (!query) {
      res.status(400);
      throw new Error('Search query is required');
    }

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});    const prompt = `Return a JSON array of 6 beautiful, popular travel destination cities matching the search query or theme: "${query}". 
    Each object must have the following exact properties:
    "id": a unique integer,
    "name": name of the city,
    "country": name of the country,
    "image": a high quality matching Unsplash image URL (e.g., https://images.unsplash.com/photo-1502602861271-e970a25df600?auto=format&fit=crop&q=80&w=600),
    "rating": a realistic rating between 4.0 and 5.0,
    "costIndex": a cost indicator string ranging from "$" to "$$$$".
    
    Output ONLY valid JSON. Do not use markdown blocks (e.g. \`\`\`json). Return the raw array starting with [ and ending with ].`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up markdown if the AI includes it despite instructions
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '').replace(/```/g, '').trim();
    }

    const parsedJson = JSON.parse(text);
    res.json(parsedJson);
  } catch (error) {
    console.error('Gemini City Search Error:', error);
    res.status(500);
    next(new Error('Failed to generate cities from AI. Please try again later.'));
  }
};

export const searchActivities = async (req, res, next) => {
  try {
    const { city, type } = req.body;
    if (!city || !type) {
      res.status(400);
      throw new Error('City and activity type are required');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `Return a JSON array of 5 interesting and popular travel activities in ${city} that match the category: "${type}". 
    Each object must have the following exact properties:
    "id": a unique integer,
    "title": name of the activity,
    "description": a short, exciting 1-2 sentence description,
    "duration": duration in minutes (integer),
    "cost": estimated cost in USD (integer),
    "type": the category ("${type}"),
    "rating": a realistic rating between 4.0 and 5.0.

    Output ONLY valid JSON. Do not use markdown blocks (e.g. \`\`\`json). Return the raw array starting with [ and ending with ].`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up markdown if the AI includes it despite instructions
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '').replace(/```/g, '').trim();
    }

    const parsedJson = JSON.parse(text);
    res.json(parsedJson);
  } catch (error) {
    console.error('Gemini Activity Search Error:', error);
    res.status(500);
    next(new Error('Failed to generate activities from AI. Please try again later.'));
  }
};
